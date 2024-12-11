const express = require("express");
const router = express.Router();
const { CommonCode, CommonDetailCode } = require("../models");

// 기초코드 - 기초상세코드명 전체 조회
router.get("/:number", async (req, res) => {
  try {
    const { number } = req.params; // ag. CMCD01 > '1' 숫자만 입력 받음.
    const AUTHCD = req.headers['authcd']; // FE getCmDtNms 함수 - headers 소문자 key로 가져와야함.

    // console.log("AUTHCD > ", AUTHCD);

    // 1. DB sequelize로 공통,상세코드 조회
    const cmDts = await CommonDetailCode.findAll({
      attributes: ["cmCd","cmDtCd","cmDtName"],
      where: { cmCd: `CMCD0${number}`, },
      include: {
        model: CommonCode,
        attributes: ["cmName"],
        where : { cmCd: `CMCD0${number}`, },
      }
    });
    // console.log("DB > ", cmDts);

    // 2. response 구조를 위해서 데이터 재가공
    const result = {
      cmCd: cmDts[0].cmCd,
      cmName: cmDts[0].CommonCode.cmName,
      cmDts : cmDts.map(item => {
        return {
          cmDtCd : item.cmDtCd,
          cmDtName : item.cmDtName
        };
      }),
    };
    // console.log("result > ". result);

    // 3. 권한별 데이터 재가공 (다른 공통코드도 여기에 추가)
    if (AUTHCD === "AUTH02" && number === "2") {
      result.cmDts = result.cmDts.filter((item) => item.cmDtCd !== 3); // 학생이면 3번 '수강생 추가' 제거
    }
    // console.log("final > ", result);

    res.status(200).json({ success: true,  documents: result, message: "기초코드 - 기초상세코드명 가져오기 성공", });
  } catch (error) {
    res.status(500).json({ success: false, message: "기초코드 - 기초상세코드명 가져오기 실패",
    });
  }
});

module.exports = router;
