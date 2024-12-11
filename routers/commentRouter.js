const express = require("express");
const { User, Post, AttachedFile, Comment } = require("../models/index");
const { getCmDtNm, getCourseNm } = require("../utils/commonUtils");
const { createNotifications } = require("../utils/notification.js");
const { format } = require("date-fns");
const router = express.Router();

/** 게시글 상세 조회 (게시글 1개 + 댓글 목록 조회) */
router.get("/:postID/comments", async (req, res, next) => {
  try {
    // console.log("post/?/comments 도달");
    const { courseID, postID, cmDtCd } = req.query;
    let tempProfileImage = "default.jpg";

    // 1-1. 게시글 id로, 게시글 상세 내용 조회
    const post = await Post.findOne({
      attributes: ["courseID", "cmDtCd", "postID", "writerID", "title", "content", "createdAt"],
      where: { courseID, postID, cmDtCd },
      include: [
        {
          model: User,
          attributes: ["userName", "nickname","profileImage"],
          required: true,
        },
      ],
    });
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // 1-2. 게시글 작성자의 프로필 사진 조회
    if (post.User.profileImage == null) {
        post.User.profileImage = tempProfileImage ;
    }

    const courseName = await getCourseNm(post.courseID);
    const cmDtName = await getCmDtNm("CMCD02", post.cmDtCd);

    // 2. 게시글에 등록된 사진 조회
    const postImages = await AttachedFile.findAll({
      attributes: ["fileName"],
      where: { postID },
      order: [["fileName", "ASC"]], // fileName을 역순으로 정렬
    });

    // 3-1. 게시글 id로 댓글 전체 조회
    const comments = await Comment.findAll({
      attributes: ["courseID", "postID", "commentID", "writerID", "content", "createdAt"],
      where: { courseID: courseID, postID: postID },
      include: [
        {
          model: User,
          attributes: ["userName","profileImage"],
          required: true,
        },
      ],
      order: [["commentID", "ASC"]], // commentID를 내림차 순으로 정렬
    });

    // 3-2. 게시글 id에 댓글이 1개 이상 있다면
    if (comments.length > 0) {
      // 댓글 작성자의 프로필 사진 확인
      comments.map((comment) => {
        if (comment.User.profileImage == null) {
          comment.User.profileImage = tempProfileImage ;
        }
      });
      // 게시글에 담기
      post.comments = { comments };
    }

    const result = {
      courseID: post.courseID,
      courseNm: courseName,
      cmDtCd: post.cmDtCd,
      cmDtNm: cmDtName,
      postID: post.postID,
      title: post.title,
      content: post.content,
      postImages: postImages.map((images) => images.fileName), // fileName만 추출
      writerID: post.writerID,
      writerNm: post.User.userName,
      nickname: post.User.nickname,
      profileImage: post.User.profileImage,
      createdAt: format(new Date(post.createdAt), "yyyy-MM-dd  HH:mm"),
      comments: comments.map((comment) => {
        return {
          courseID: post.courseID,
          postID: post.postID,
          cmDtCd: post.cmDtCd,
          commentID: comment.commentID,
          teacherID: comment.writerID,
          teacherNm: comment.User.userName,
          profileImage: comment.User.profileImage,
          content: comment.content,
          createdAt: format(new Date(comment.createdAt), "yyyy-MM-dd  HH:mm"),
        };
      }),
    };

    // const result = results.map(post => ({
    //     ...post.dataValues, // 기존 데이터 복사
    //     createdAt: format(new Date(post.createdAt), 'yyyy-MM-dd'), // 날짜 변환
    // }));

    // console.log("commentRouter 1개 게시글 & 댓글 여러개 result > ", result)

    if (post) {
      res.status(201).json({ success: true, documents: result, message: `${courseName} - ${cmDtName} 게시글 목록 조회 성공` });
    } else {
      res.status(400).json({ success: false, documents: [], message: `${courseName} - ${cmDtName} 게시글 목록 조회 실패` });
    }
  } catch (error) {
    console.log(error);
    next(error, req, res);
  }
});

/** 댓글 등록 */
router.post("/:postID/comment", async (req, res, next) => {
  // postman에서 Body:raw:JSON 으로 해야함.
  // form-data => Content-Type : multipart/form-data는 단순 JSON 텍스트 처리엔 부적합.
  // raw.JSON  => express.json() 미들웨어가 Content-Type: application/json로 전송해줌.

  const { courseID, postID, userID, content } = req.body;

  try {
    // console.log(req.body);
    // 게시글 존재 확인
    const post = await Post.findOne({ where: { postID } });
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // 댓글 신규 추가
    const result = await Comment.create({ courseID, postID, writerID: userID, content });
    const cmDtCd = await Post.findOne({
      attributes: ["cmDtCd"],
      where: { courseID, postID },
    });

    if (result) {
      console.log("newComment =======================> req.body=", req.body);

      await createNotifications({
        courseID: Number(req.body.courseID),
        // title: "댓글은 제목 없음",
        content: req.body.content,
        postID: Number(req.body.postID),
        // cmDtCd: Number(cmDtCd.cmDtCd)
      });
      return res.status(201).json({ success: true, documents: [], message: "댓글 등록 성공" });
    } else {
      res.status(400).json({ success: false, message: "댓글 등록 실패" });
    }
  } catch (error) {
    console.log(error);
    next(error, req, res);
  }
});

/** 댓글 수정 */
router.put("/:postID/comment/:commentID", async (req, res, next) => {
  try {
    const { postID, commentID } = req.params;
    const { content, userID } = req.body; // userID = jwt에서 가져올 수 있음 가져오고, body에 안 넣고 headers나 어디서 가져오는지 Swift ViewModel과 연동

    // 게시글의 해당 댓글 존재 확인
    const comment = await Comment.findOne({ where: { commentID, postID, writerID: userID } });
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // 댓글 수정
    const result = await Comment.update({ content }, { where: { commentID, postID, writerID: userID } });

    if (result) {
      res.status(201).json({ success: true, message: "댓글 수정 성공" });
    } else {
      res.status(400).json({ success: false, message: "댓글 수정 실패" });
    }
  } catch (error) {
    console.log(error);
    next(error, req, res);
  }
});

/** 댓글 삭제 */
router.delete("/:postID/comment/:commentID/:userID", async (req, res, next) => {
  try {
    const { postID, commentID, userID } = req.params;
    // const userID = Number(req.headers['USERID']);
    // console.log("postID, commentID, userID > ", postID, commentID, userID);

    // 게시글의 해당 댓글 존재 확인
    const comment = await Comment.findOne({ where: { commentID, postID, writerID: userID } });
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // 해당 댓글 삭제
    const result = await Comment.destroy({ where: { commentID, postID, writerID: userID } });

    if (result) {
      res.status(200).json({ success: true, message: "댓글 삭제 성공" });
    } else {
      res.status(400).json({ success: false, message: "댓글 삭제 실패" });
    }
  } catch (error) {
    console.log(error);
    next(error, req, res);
  }
});

module.exports = router;
