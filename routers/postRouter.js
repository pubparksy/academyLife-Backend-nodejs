const express = require('express');
const { User, Post, AttachedFile, Comment } = require('../models/index');
const { createNotifications } = require("../utils/notification.js");
const { getCmDtNm, getUserNm, getCourseNm  } = require("../utils/commonUtils");
const { format } = require('date-fns');
const router = express.Router();
const upload = require('./uploadImage');
const { BlobServiceClient } = require('@azure/storage-blob');

/** 게시판 목록 조회 (게시글들만 조회, 댓글 미조회) */
router.get("/", async (req, res, next) => {
    try {
        // get으로 오는 params는 req.query , post로 오는 body는 req.body
        const { courseID, cmDtCd, userID, page, size } = req.query;
        const AUTHCD = req.headers['AUTHCD']; 
        
        const courseName = await getCourseNm(courseID);
        const cmDtName = await getCmDtNm("CMCD02", cmDtCd);
        const userName = await getUserNm(userID);
        let tempProfileImage = "default.jpg";

        const posts = await Post.findAll({
            attributes: ['courseID', 'cmDtCd', 'postID', 'title', 'content', 'writerID', 'createdAt'],
            where: {
                courseID: courseID,
                cmDtCd: cmDtCd,
            },
            include: [{
                model: User,
                attributes: ['userName', 'profileImage'],
                required: true
            }],
            order: [['postID', 'DESC']] // createdAt을 역순으로 정렬
        });

          posts.map((post) => {
            if (post.User.profileImage == null) {
                post.User.profileImage = tempProfileImage ;
            }
        })

           
       
        const result = {
            courseID : Number(courseID),
            courseName : courseName,
            cmDtCd : Number(cmDtCd),
            cmDtName : cmDtName,
            coursePosts: posts.map( post => {
                return {
                    courseID : Number(courseID),
                    cmDtCd : Number(cmDtCd),
                    postID: post.postID,
                    title: post.title,
                    content: post.content,
                    writerID: post.writerID,
                    writerNm : post.User.userName,
                    profileImage: post.User.profileImage,
                    createdAt : format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm'),
                };
            })
        };
        // console.log("result > ", result);


        // const result = results.map(post => ({
        //     ...post.dataValues, // 기존 데이터 복사
        //     createdAt: format(new Date(post.createdAt), 'yyyy-MM-dd'), // 날짜 변환
        // }));
        if (result) {
            res.status(201).json({ success: true, documents: result, message: '게시판 목록 조회 성공' });
        } else {
            res.status(400).json({ success: false, message: '게시판 목록 조회 실패' });
        }
        
    } catch (error) {
        console.log(error);
        next(error, req, res);
    }
});

/** 게시글 신규 등록 - 선생님이 공지글 작성하거나, 학생이 문의글 작성해도 이 라우터 탐 */
router.post("/", async (req, res, next) => {
    try {
        // 1. 파일 업로드 관련 Multer 미들웨어 실행 - 허용되지 않은 확장자일 경우 에러 반환.
        await new Promise((resolve, reject) => {
            upload.array('images')(req, res, (err) => { // 'images' < multiForm에서 사진파일들의 key 이름
                if (err) {
                    return reject(err); // Multer 에러 발생 시 reject
                }
                resolve();
            });
        });
  
        // 2. Multer 성공되어야만 DB post table INSERT
        const { courseID, cmDtCd, userID, title, content } = req.body;
        const AUTHCD = req.headers['AUTHCD']; 

        if (AUTHCD == 'AUTH02' && cmDtCd == 1) {
            return res.status(400).json({ success: false, documents: [], message: '게시물 등록 - 권한 실패' });
        }

        const newPost = { cmDtCd, courseID, writerID : userID, title, content, };
        const result = await Post.create(newPost);

        // 3. 파일이 있으면, 파일명을 db file table INSERT
        const newPostID = result.postID; // 새로 생성된 postID
        const newFileArr = req.files?.map(file => file.blobName) || [];
        if (newFileArr.length > 0) {
            for (const fileName of newFileArr) {
                const newFile = { postID: newPostID, fileName: fileName, };
                await AttachedFile.create(newFile);
            }
        }

        console.log("Post.create(newPost)의 result.postID >>>> ", result.postID);

        if (result) {
            console.log("newPost ========================> req.body=",req.body);

            const postPushNoti = await createNotifications({
                courseID: Number(req.body.courseID),
                title: req.body.title,
                content: req.body.content,
                postID: Number(result.postID),
                cmDtCd: Number(req.body.cmDtCd)
            });
            console.log("postPushNoti=", postPushNoti);
            if(postPushNoti != null) {
                return res.status(201).json({ success: true, documents: [], message: "게시물 등록 성공 & 푸시 알림 성공" });
            } else {
                return res.status(201).json({ success: false, documents: [], message: "게시물 등록 성공 & 푸시 알림 실패" });
            }
            // return res.status(201).json({ success: true, documents: [], message: "게시물 등록 성공" });
        } else {
            return res.status(400).json({ success: false, message: '게시물 등록 실패' });
        }
    } catch (error) {
        // 1-error. Multer 에러가 허용되지 않은 파일 확장자인 경우
        if (error.message === 'fileExtensionDenied') {
            return res.status(400).json({ success: false, message: '허용되지 않은 파일 확장자' });
        }

        // 기타 에러 처리
        console.error(error);
        next(error);
    }
  });
/** 사진 등록 (게시글 등록과 동시) uploadImage.js에서 Azure Portal Storage Blob Container에 사진 파일 저장 **/
// router.post('/', upload.single('fileName'));
// router.post('/', upload.single('fileName1'), upload.single('fileName2'), upload.single('fileName3'));


/**
 * router.put('/:postID', validateTokenMiddleware, upload.single('fileName'), async (req, res) => {
 * 이런식으로 
 * 	path: /:postID (동적 URL 파라미터 포함). // path는 반드시 첫 번째 인자여야함.
	handlers:
    1.	validateTokenMiddleware (JWT 인증 미들웨어).
	2.	upload.single('fileName') (파일 업로드 미들웨어). 
	3.	최종 처리 함수 (req, res). // 미들웨어 순서대로 실행 후 최종 함수 처리.

	•	첫 번째 미들웨어에서 요청이 처리되지 않으면, next()를 호출해 다음 미들웨어로 넘깁니다. multer 미들웨어는 라이브러리에 next() 호출해서 명시안해도 됨.
	•	미들웨어에서 next()를 호출하지 않으면, 해당 요청은 종료됩니다.
 */

/** 게시글 수정  URL 경로, 미들웨어(옵션), 그리고 최종 처리 함수 */
router.put("/:postID", async (req, res, next) => {
    try {
        const { postID } = req.params;

        // 1. 기존 게시글 존재 여부 확인
        const existingPost = await Post.findOne({ where: { postID } });
        if (!existingPost) {
            return res.status(404).json({ success: false, message: "게시글을 찾을 수 없습니다." });
        }
        
        // 2. 새로 업로드된 파일의 확장자 검증 - 허용되지 않은 확장자일 경우 에러 반환.
        await new Promise((resolve, reject) => {
            upload.array('fileName')(req, res, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });

        const { title, content } = req.body;

        // 3. 제목과 내용 업데이트 (파일 처리와 별도 진행)
        const updatedPost = { title, content };
        const postUpdateResult = await Post.update(updatedPost, { where: { postID } });

        if (!postUpdateResult || postUpdateResult[0] === 0) {
            return res.status(400).json({ success: false, message: "게시글 수정 실패 (내용 업데이트 실패)" });
        }

        // console.log("게시글 업데이트 성공:", updatedPost);

        // 4. 파일 처리 (새로운 파일이 있을 경우에만 실행)
        if (req.files && req.files.length > 0) {
            // 기존 파일 삭제
            const existingPostFiles = await AttachedFile.findAll({ where: { postID } });
            const oldPostFilesArr = existingPostFiles?.map(file => file.dataValues.fileName) || [];
            if (oldPostFilesArr.length > 0) {
                const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.SA_CONNECTION_STRING);
                const containerClient = blobServiceClient.getContainerClient('academylife');
                for (const oldFileName of oldPostFilesArr) {
                    const blobClient = containerClient.getBlobClient(oldFileName);
                    const deleteResponse = await blobClient.deleteIfExists();
                    console.log(`Deleted Azure Blob old file: ${oldFileName}`, deleteResponse.succeeded ? "Success" : "Failed");
                }
                await AttachedFile.destroy({ where: { postID } });
            }

            // 새로운 파일 저장
            const newFileArr = req.files.map(file => file.blobName);
            for (const fileName of newFileArr) {
                const newFile = { postID, fileName };
                await AttachedFile.create(newFile); // 새 파일 데이터 저장
            }
            console.log("새 파일 업로드 및 저장 성공:", newFileArr);
        } else {
            console.log("새로운 파일 없음, 기존 파일 유지");
        }

        if (postUpdateResult) {
            res.status(200).json({ success: true, documents : [], message: "게시글 수정 성공" });
        } else {
            res.status(400).json({ success: false, documents : [], message: '게시물 수정 실패' });
        }
    } catch (error) {
        if (error.message === 'fileExtensionDenied') { // 허용되지 않은 확장자 처리
            return res.status(400).json({ success: false, message: '허용되지 않은 파일 확장자' });
        }
        console.log(error);
        next(error, req, res);
    }
});


/** 게시글 삭제 */
router.delete("/:postID", async (req, res, next) => {
    try {
        const { postID } = req.params;

        // 1. 게시글, 댓글 존재 확인
        const existingPost = await Post.findOne({ where: { postID } });
        const existingComment = await Comment.findAll({ where: { postID } });

        if (!existingPost) {
            return res.status(404).json({ success: false, message: "게시글을 찾을 수 없습니다." });
        }

        if (existingComment.length > 0) {
            // 댓글이 존재할 경우 삭제 불가
            return res.status(400).json({ success: false, message: "댓글이 존재하여 삭제할 수 없습니다." });
        }

        // 2. Azure Blob 파일 삭제
        const existingPostFiles = await AttachedFile.findAll({ where: { postID } });
        const oldPostFilesArr = existingPostFiles?.map(file => file.dataValues.fileName) || [];

        if (oldPostFilesArr.length > 0) {
            try { // BlobServiceClient 사용할거면 위에 require('@azure/storage-blob'); 해야함.
                const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.SA_CONNECTION_STRING);
                // const containerClient = blobServiceClient.getContainerClient('academylife'); // 나중에 이거로 바꿔야함
                const containerClient = blobServiceClient.getContainerClient('academylife');

                for (const oldFileName of oldPostFilesArr) {
                    const blobClient = containerClient.getBlobClient(oldFileName);
                    await blobClient.deleteIfExists();
                }
            } catch (error) {
                console.error("Azure Blob 파일 삭제 중 오류:", error.message);
            }
        }

        // 3. Pg DB Row 삭제
        await AttachedFile.destroy({ where: { postID } });
        const result = await Post.destroy({ where: { postID } });

        if (result) {
            return res.status(200).json({ success: true, message: "게시글을 삭제했습니다." });
        } else {
            return res.status(400).json({ success: false, message: "게시글 삭제 실패" });
        }
    } catch (error) {
        console.error(error);
        next(error, req, res);
    }
});


module.exports = router;
