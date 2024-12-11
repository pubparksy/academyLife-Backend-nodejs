const { sequelize } = require("./index.js");
const queryInterface = sequelize.getQueryInterface();
const now = new Date();

const sync = () => {
  sequelize
    .sync({ force: true, alter: true })
    .then(() => {
      console.log("학원생활 데이터베이스 생성 완료");
      console.log("===============================================================================");
      seedCommon();
      // seedSample();
    }).catch((error) => {
      console.error("Error syncing the database:", error); // Provide more detailed error logging
    });
};

const seedCommon = () => {
  queryInterface.bulkInsert("authCode", [
      { authID: "AUTH99", authName: "시스템관리자" },
      { authID: "AUTH01", authName: "선생님" },
      { authID: "AUTH02", authName: "학생" },
    ]).then(() => {
      console.log("authCode seed 삽입 완료");
    }).catch((error) => {
      console.error("Error syncing the authCode:", error);
    });

  queryInterface.bulkInsert("commonCode", [
      { cmCd: "CMCD01", cmName: "강좌분류" },
      { cmCd: "CMCD02", cmName: "게시분류" },
      { cmCd: "CMCD03", cmName: "출석상태" },
      { cmCd: "CMCD04", cmName: "알림분류" },
    ]).then(() => {
      console.log("commonCode seed 삽입 완료");

      queryInterface.bulkInsert("commonDetailCode", [
          { cmCd: "CMCD01", cmDtCd: "1", cmDtName: "정보통신" },
          { cmCd: "CMCD01", cmDtCd: "2", cmDtName: "조리.제과제빵" },
          { cmCd: "CMCD01", cmDtCd: "3", cmDtName: "섬유.의복" },
          { cmCd: "CMCD02", cmDtCd: "1", cmDtName: "공지사항" },
          { cmCd: "CMCD02", cmDtCd: "2", cmDtName: "문의 게시판" },
          { cmCd: "CMCD02", cmDtCd: "3", cmDtName: "수강생 추가" },
          { cmCd: "CMCD03", cmDtCd: "1", cmDtName: "출석" },
          { cmCd: "CMCD03", cmDtCd: "2", cmDtName: "지각" },
          { cmCd: "CMCD03", cmDtCd: "3", cmDtName: "결석" },
          { cmCd: "CMCD04", cmDtCd: "1", cmDtName: "공지글 알림" },
          { cmCd: "CMCD04", cmDtCd: "2", cmDtName: "문의글 알림" },
          { cmCd: "CMCD04", cmDtCd: "3", cmDtName: "문의글 답변 알림" },
        ]).then(() => {
          console.log("commonDetailCode seed 삽입 완료");
        }).catch((error) => {
          console.error("Error syncing the commonDetailCode:", error);
        });
    }).catch((error) => {
      console.error("Error seed commonCode :", error);
    });
};

const seedSample = () => {
  queryInterface.bulkInsert("user", [
    // 학생
    { email: "s1@a.com", authCd: "AUTH02", password: "$2b$10$upD8bZDqGC4ZwQGSuUuUp.g2.iEtJFjC1.pa8MxEwDuKex9N500p.", userName: "박소영", nickname: "별명1", mobile: "01022223333", createdAt: now, updatedAt: now },
    { email: "s2@a.com", authCd: "AUTH02", password: "$2b$10$upD8bZDqGC4ZwQGSuUuUp.g2.iEtJFjC1.pa8MxEwDuKex9N500p.", userName: "서희재", nickname: "별명2", mobile: "01022223334", createdAt: now, updatedAt: now },
    { email: "s3@a.com", authCd: "AUTH02", password: "$2b$10$upD8bZDqGC4ZwQGSuUuUp.g2.iEtJFjC1.pa8MxEwDuKex9N500p.", userName: "오세영", nickname: "별명3", mobile: "01022223335", createdAt: now, updatedAt: now },
    { email: "s4@a.com", authCd: "AUTH02", password: "$2b$10$upD8bZDqGC4ZwQGSuUuUp.g2.iEtJFjC1.pa8MxEwDuKex9N500p.", userName: "윤정한", nickname: "별명4", mobile: "01022223336", createdAt: now, updatedAt: now },
    { email: "s5@a.com", authCd: "AUTH02", password: "$2b$10$upD8bZDqGC4ZwQGSuUuUp.g2.iEtJFjC1.pa8MxEwDuKex9N500p.", userName: "권순영", nickname: "별명5", mobile: "01033333337", createdAt: now, updatedAt: now },
    { email: "s6@a.com", authCd: "AUTH02", password: "$2b$10$upD8bZDqGC4ZwQGSuUuUp.g2.iEtJFjC1.pa8MxEwDuKex9N500p.", userName: "홍지수", nickname: "별명6", mobile: "01033333338", createdAt: now, updatedAt: now },
    { email: "s7@a.com", authCd: "AUTH02", password: "$2b$10$upD8bZDqGC4ZwQGSuUuUp.g2.iEtJFjC1.pa8MxEwDuKex9N500p.", userName: "유지민", nickname: "별명7", mobile: "01033333339", createdAt: now, updatedAt: now },
    { email: "s8@a.com", authCd: "AUTH02", password: "$2b$10$upD8bZDqGC4ZwQGSuUuUp.g2.iEtJFjC1.pa8MxEwDuKex9N500p.", userName: "김민정", nickname: "별명8", mobile: "01044443340", createdAt: now, updatedAt: now },
    { email: "s9@a.com", authCd: "AUTH02", password: "$2b$10$upD8bZDqGC4ZwQGSuUuUp.g2.iEtJFjC1.pa8MxEwDuKex9N500p.", userName: "전소연", nickname: "별명9", mobile: "01044443341", createdAt: now, updatedAt: now },
    { email: "s10@a.com", authCd: "AUTH02", password: "$2b$10$upD8bZDqGC4ZwQGSuUuUp.g2.iEtJFjC1.pa8MxEwDuKex9N500p.", userName: "차은우", nickname: "별명10", mobile: "01044443342", createdAt: now, updatedAt: now },
    // 선생
    { email: "t11@b.com", authCd: "AUTH01", password: "$2b$10$upD8bZDqGC4ZwQGSuUuUp.g2.iEtJFjC1.pa8MxEwDuKex9N500p.", userName: "이영록", nickname: "별명11", mobile: "01055553333", createdAt: now, updatedAt: now },
    { email: "t12@b.com", authCd: "AUTH01", password: "$2b$10$upD8bZDqGC4ZwQGSuUuUp.g2.iEtJFjC1.pa8MxEwDuKex9N500p.", userName: "백종원", nickname: "별명12", mobile: "01055553334", createdAt: now, updatedAt: now },
    { email: "t13@b.com", authCd: "AUTH01", password: "$2b$10$upD8bZDqGC4ZwQGSuUuUp.g2.iEtJFjC1.pa8MxEwDuKex9N500p.", userName: "앙드레김", nickname: "별명13", mobile: "01055553335", createdAt: now, updatedAt: now },
    // 시스템 관리자
    { email: "admin@a.com", authCd: "AUTH99", password: "$2b$10$upD8bZDqGC4ZwQGSuUuUp.g2.iEtJFjC1.pa8MxEwDuKex9N500p.", userName: "시스템관리자1", nickname: "admin1", mobile: "01099998888", createdAt: now, updatedAt: now },
  ]).then(() => {
    console.log("user seed 삽입 완료");

    queryInterface.bulkInsert("course", [
        // 강좌 목록
        { cmDtCd: "1", courseName: "iOS", courseDesc: "Xcode, 월수금, 10시~12시", startDate: "20240101", endDate: "20240201", userID: "11", createdAt: now, updatedAt: now },
        { cmDtCd: "1", courseName: "JavaScript", courseDesc: "VSCode, 화목토, 11시~1시", startDate: "20240201", endDate: "20240301", userID: "11", createdAt: now, updatedAt: now },
        { cmDtCd: "1", courseName: "Postgres", courseDesc: "DBeaver, 월수, 1시~3시", startDate: "20240301", endDate: "20240401", userID: "11", createdAt: now, updatedAt: now },
        { cmDtCd: "1", courseName: "Azure", courseDesc: "AzurePortal, 화목, 3시~5시", startDate: "20240401", endDate: "20240501", userID: "11", createdAt: now, updatedAt: now },
        { cmDtCd: "2", courseName: "바리스타1급", courseDesc: "원두 감별, 월목, 2시~5시", startDate: "20240501", endDate: "20240601", userID: "12", createdAt: now, updatedAt: now },
        { cmDtCd: "2", courseName: "바리스타2급", courseDesc: "라떼아트, 화금, 3시~6시", startDate: "20240601", endDate: "20240701", userID: "12", createdAt: now, updatedAt: now },
        { cmDtCd: "2", courseName: "제빵기능사", courseDesc: "식품위생학, 주중, 10시~1시", startDate: "20240701", endDate: "20240801", userID: "12", createdAt: now, updatedAt: now },
        { cmDtCd: "2", courseName: "제빵산업기사", courseDesc: "제과점 관리, 주중, 9시~11시", startDate: "20240801", endDate: "20240901", userID: "12", createdAt: now, updatedAt: now },
        { cmDtCd: "3", courseName: "재봉틀-초급", courseDesc: "노루발, 월수, 1시~2시", startDate: "20240901", endDate: "20241001", userID: "13", createdAt: now, updatedAt: now },
        { cmDtCd: "3", courseName: "재봉틀-중급", courseDesc: "원단감별, 화목, 2시~3시", startDate: "20241001", endDate: "20241101", userID: "13", createdAt: now, updatedAt: now },
        { cmDtCd: "3", courseName: "재봉틀-고급", courseDesc: "주름잡기, 수금, 3시~5시", startDate: "20241101", endDate: "20241201", userID: "13", createdAt: now, updatedAt: now },
      ]).then(() => {
        console.log("course seed 삽입 완료");

        queryInterface.bulkInsert("student", [
          // 강좌 <-> 수강생
          { courseID: "1", userID: "1", createdAt: now, updatedAt: now },
          { courseID: "1", userID: "2", createdAt: now, updatedAt: now },
          { courseID: "1", userID: "3", createdAt: now, updatedAt: now },
          { courseID: "1", userID: "4", createdAt: now, updatedAt: now },
          { courseID: "1", userID: "5", createdAt: now, updatedAt: now },
          { courseID: "1", userID: "6", createdAt: now, updatedAt: now },
          { courseID: "1", userID: "7", createdAt: now, updatedAt: now },
          { courseID: "1", userID: "8", createdAt: now, updatedAt: now },
          { courseID: "1", userID: "9", createdAt: now, updatedAt: now },
          { courseID: "1", userID: "10", createdAt: now, updatedAt: now },
          { courseID: "2", userID: "1", createdAt: now, updatedAt: now },
          { courseID: "2", userID: "2", createdAt: now, updatedAt: now },
          { courseID: "2", userID: "3", createdAt: now, updatedAt: now },
          { courseID: "2", userID: "4", createdAt: now, updatedAt: now },
          { courseID: "2", userID: "5", createdAt: now, updatedAt: now },
          { courseID: "3", userID: "6", createdAt: now, updatedAt: now },
          { courseID: "3", userID: "7", createdAt: now, updatedAt: now },
          { courseID: "3", userID: "8", createdAt: now, updatedAt: now },
          { courseID: "3", userID: "9", createdAt: now, updatedAt: now },
          { courseID: "3", userID: "10", createdAt: now, updatedAt: now },
          { courseID: "4", userID: "1", createdAt: now, updatedAt: now },
          { courseID: "4", userID: "2", createdAt: now, updatedAt: now },
          { courseID: "4", userID: "3", createdAt: now, updatedAt: now },
          // 조리
          { courseID: "5", userID: "1", createdAt: now, updatedAt: now },
          { courseID: "5", userID: "4", createdAt: now, updatedAt: now },
          { courseID: "5", userID: "7", createdAt: now, updatedAt: now },
          { courseID: "6", userID: "2", createdAt: now, updatedAt: now },
          { courseID: "6", userID: "5", createdAt: now, updatedAt: now },
          { courseID: "6", userID: "8", createdAt: now, updatedAt: now },
          { courseID: "7", userID: "3", createdAt: now, updatedAt: now },
          { courseID: "7", userID: "6", createdAt: now, updatedAt: now },
          { courseID: "7", userID: "9", createdAt: now, updatedAt: now },
          { courseID: "8", userID: "10", createdAt: now, updatedAt: now },
          // 재봉틀
          { courseID: "9", userID: "7", createdAt: now, updatedAt: now },
          { courseID: "9", userID: "8", createdAt: now, updatedAt: now },
          { courseID: "9", userID: "9", createdAt: now, updatedAt: now },
          { courseID: "9", userID: "10", createdAt: now, updatedAt: now },
          { courseID: "10", userID: "7", createdAt: now, updatedAt: now },
          { courseID: "10", userID: "8", createdAt: now, updatedAt: now },
          { courseID: "10", userID: "9", createdAt: now, updatedAt: now },
          { courseID: "10", userID: "10", createdAt: now, updatedAt: now },
          { courseID: "11", userID: "7", createdAt: now, updatedAt: now },
          { courseID: "11", userID: "8", createdAt: now, updatedAt: now },
          { courseID: "11", userID: "9", createdAt: now, updatedAt: now },
          { courseID: "11", userID: "10", createdAt: now, updatedAt: now },
        ]).then(() => {
          console.log("student seed 삽입 완료");
            
          queryInterface.bulkInsert("post", [
            // 게시글 목록
            { courseID: "1", cmDtCd: "1", writerID:"11", title:"iOS 공지1-학원비 변경",content:"공지안내1-iOS 학원비 인상 공지 안내드립니다.\n2025년 1월부터 학원비가 3만원 추가 인상되었으므로,\n이에 대한 숙지 참고 부탁드립니다.", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "1", writerID:"11", title:"iOS 공지2-개강일 안내",content:"공지안내2-iOS 개강일 공지 안내드립니다. 2025년 신학기 개강일은 3월 2일 부터입니다.\n감사합니다.", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "1", writerID:"11", title:"iOS 공지3-방역 안내",content:"공지안내3-iOS 코로나19 방역 관련하여 공지 안내드립니다. 학원 건물에서 1일 1회 방역하고 있습니다.\n학생들은 몸 상태를 살피어 마스크 작용 부탁드립니다.", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "1", writerID:"11", title:"iOS 공지4-모니터 변경",content:"공지안내4-iOS 모니터 변경 공지 안내드립니다. 학원에서 기존에 사용하던 DELL 모니터가 노후화되어\n전체 ASUS 모니터로 변경되었습니다. 감사합니다.", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "1", writerID:"11", title:"iOS 공지5-숙제 안내",content:"공지안내5-iOS 숙제 관련 안내 드립니다.\nCS 관련 지식이 부족하다고 느껴지는 학우 분들은\n필히 정보처리기사 공부를 추천드립니다.\n하드웨어, OS 관련 지식은 개발에 있어 필히 필요한 정보입니다.", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "1", writerID:"11", title:"iOS 공지6-CI/CD 학습자료",content:"공지안내6-iOS CI/CD 관련 공지 안내드립니다.\n현재 진행 중인 Azure로 빌드 배포는 DevOps의 발판으로 이에 대한 흐름을 인지하고 싶다면 AWS도 학습하는 걸 추천드립니다.", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "1", writerID:"11", title:"iOS 공지7-DBA",content:"공지안내7-iOS Database 관련 공지드립니다.\n가장 많이 쓰이는 Oracle, MSSQL(Microsoft SQL), MySql, MariaDB, Postgresql이며,\nNoSql(Not only SQL)로는 MongoDB, Firebase 등이 있습니다.", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "1", writerID:"11", title:"iOS 공지8-이벤트 안내",content:"공지안내8-iOS 설문조사 관련 공지드립니다.\n이벤트에 참여하신 분들 중 추첨에 당첨된 분들께 스타벅스 쿠폰을 드립니다.", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "1", writerID:"11", title:"iOS 공지9-강사 변경",content:"공지안내9-iOS 강사 변경 안내드립니다.\n기존의 이영록 강사님께서 개인 사정으로 인하여, 다른 강사님으로 변경될 예정입니다. 참고 부탁드립니다.", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "1", writerID:"11", title:"iOS 공지10-연말정산 안내",content:"공지안내10-iOS 연말 정산 관련 안내드립니다.\n관련 된 내용은 첨부파일 사진 속 내용 참고 부탁드립니다. 감사합니다.", createdAt: now, updatedAt: now },

            { courseID: "1", cmDtCd: "2", writerID:"1", title:"문의1-iOS 학원비 질문요",content:"문의 내용1-다른 강좌 학원비는 변동이 없는지 궁금합니다.\n그리고 소개로 수강생 등록시 할인은 없나요?", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "2", writerID:"1", title:"문의2-iOS 교실 관련",content:"문의 내용2-기존에 뫄뫄 건물 2층 201호실이었잖아요.\n저번에 독서실로 써도 된대서 갔는데 다른 참관회가 있더라고요.\n외부인이 들어오는 거 막아주세요.", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "2", writerID:"1", title:"문의3-iOS 결석 증빙",content:"문의 내용3-대학병원 갔다 와야하는데 어떤 증빙서류 제출하면 되나요?\n그리고 진단서 추가비 내야할 수도 있는데 제출하면 환급금 주시나요?\n또 결석하면 수업 자료는 어떻게 받나요?", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "2", writerID:"4", title:"문의4-iOS 특강",content:"문의 내용4-iOS 관련해서 추가로 특강이 열리는지 궁금합니다.\niOS가 예전보단 수업이 많이 생겨났지만,\n실무에서 오래 일하신 이영록 강사님이 수업이 더 흥미롭습니다.", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "2", writerID:"4", title:"문의5-iOS CI/CD",content:"문의 내용5-CI/CD는 지금 Azure로 하는데 AWS와 많이 다른가요?\n현재 AWS 쓰는 회사가 더 많지 않나요?", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "2", writerID:"4", title:"문의6-iOS API 언어 종류",content:"문의 내용6-현재 api는 nodejs로 했는데 java로 만든 api도 Swift에서 endPoint로 사용할 수 있는거죠?", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "2", writerID:"7", title:"문의7-iOS 앱스토어 심사",content:"문의 내용7-심사가 무지막지하게 까다롭다는데,\n진짜 랜덤인가요?\n애플은 왜그러나요?", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "2", writerID:"7", title:"문의8-iOS Firebase 관련",content:"문의 내용8-Firebase 공부 중인데 \n구글링하니까 이렇게 뜨더라고요, \nFirebase 관련해서 혹시 정보를 더 주실 수 있나요?", createdAt: now, updatedAt: now },
            { courseID: "1", cmDtCd: "2", writerID:"7", title:"문의9-iOS MySql, MariaDB",content:"문의 내용9-MySql이랑 MariaDB랑 뫄뫄하면 이게 잘 안되던데\n혹시 솨솨할 땐 어떻게 하면 되는지 궁금합니다.", createdAt: now, updatedAt: now },

            { courseID: "2", cmDtCd: "1", writerID:"11", title:"JS 공지1-JavaScript 이름",content:"JS공지내용1-Java에서 Script가 붙었는데 \n둘이 같은건지 궁금해하는데, 그냥 이름만 그렇습니다. 완전 다른 언어입니다. ", createdAt: now, updatedAt: now },
            { courseID: "2", cmDtCd: "1", writerID:"11", title:"JS 공지2-JS 안내",content:"JS공지내용2-웹페이지에 생동감을 불어넣기 위해 만들어진 프로그래밍 언어로,\nECMAScript 사양을 준수하는 범용 스크립팅 언어입니다.", createdAt: now, updatedAt: now },
            { courseID: "2", cmDtCd: "1", writerID:"11", title:"JS 공지3-비동기 함수",content:"JS공지내용3-1999년부터 사용된 Ajax. 하지만 여전히 Ajax, jQuery 사용하는 곳이 많습니다. \nAjax,Promise,Await,Async 문법과 차이점을 공부해두는 편이 좋습니다.", createdAt: now, updatedAt: now },
            { courseID: "2", cmDtCd: "1", writerID:"11", title:"JS 공지4-html,css",content:"JS공지내용4-simplecss, bootstrap, toastUI 등의 cdn을 \n사용하면 간단한 class 호출로도 디자인을 좀 더 예쁘게 꾸밀 수 있습니다.", createdAt: now, updatedAt: now },
            { courseID: "2", cmDtCd: "1", writerID:"11", title:"JS 공지5-단점",content:"JS공지내용5-정적 타입을 지원하지 않으므로 \n어떤 타입의 반환값을 리턴해야 하는지 명확하지 않습니다.\n정적 타입을 지원, 컴파일 단계에서 \n오류 포착이 장점인 TypeScript를 쓰십쇼.", createdAt: now, updatedAt: now },
            { courseID: "2", cmDtCd: "1", writerID:"11", title:"JS 공지6-발전",content:"JS공지내용6-JavaScript를 충분히 숙지해야,\nReact의 DOM(Document Object Model) interface를 이해할 수 있습니다.\n아니 숙지해도 이해하기 어렵습니다.\n아무튼 React는 어렵지만 정말 속도가 빠릅니다.", createdAt: now, updatedAt: now },

            { courseID: "2", cmDtCd: "2", writerID:"2", title:"문의1-JS IDE",content:"문의 내용1-JS IDE는 뭘 쓰는게 좋나요?\n다들 VS Code 쓰던데 다른거 쓰시는 분들도 있는지 궁금합니다.", createdAt: now, updatedAt: now },
            { courseID: "2", cmDtCd: "2", writerID:"2", title:"문의2-JS Extenstion",content:"문의 내용2-JS로 편집할때 괜찮은 Extension 추천해주세요!\nPretter 이쁘긴 한데 너무 자동 변환을 잘해서, 회사 소스를 다 바꿔놓긴해서....", createdAt: now, updatedAt: now },
            { courseID: "2", cmDtCd: "2", writerID:"5", title:"문의3-JS 위치",content:"문의 내용3-JS 템플릿 뷰 엔진에서 하단에 js를 배치해야하는 이유 아시나요?\n너무 쉬워서 기술 면접에도 안나올 것 같지만..", createdAt: now, updatedAt: now },
            { courseID: "2", cmDtCd: "2", writerID:"5", title:"문의4-JS 강의실 오픈",content:"문의 내용4-JS 학원 모니터 연결해서 복습하고 싶은데\n언제 강의실이 열려있는지 알려주세요.", createdAt: now, updatedAt: now },
            { courseID: "2", cmDtCd: "2", writerID:"8", title:"문의5-JS 키보드 문의",content:"문의 내용5-JS 학원 키보드 페어링하려는데 어떻게 하면 되나요.\n다른 기기로 바꿔도 되나요", createdAt: now, updatedAt: now },
            { courseID: "2", cmDtCd: "2", writerID:"8", title:"문의6-JS 마우스 문의",content:"문의 내용6-JS 개인 마우스 추천 받습니다.\n좋은 마우스 추천받아요.\n", createdAt: now, updatedAt: now },

            { courseID: "3", cmDtCd: "1", writerID:"11", title:"Pg공지1-학원비 증가",content:"Pg공지내용1-학원비가 증가했습니다.\n3만원 인상되었으니 참고해주세요", createdAt: now, updatedAt: now },
            { courseID: "3", cmDtCd: "1", writerID:"11", title:"Pg공지2-강의실 변경",content:"Pg공지내용2-강의실이 201호에서 204호로 변경되었습니다.\n참고하고 입실 부탁드립니다.", createdAt: now, updatedAt: now },
            { courseID: "3", cmDtCd: "1", writerID:"11", title:"Pg공지3-방역 안내",content:"Pg공지내용3-코로나 감염 확진자가 나와서 방역 진행하고 있습니다. \n마스크 착용 후, 소독제를 필히 발라주시기 바랍니다.", createdAt: now, updatedAt: now },

            { courseID: "3", cmDtCd: "2", writerID:"3", title:"문의1-Pg",content:"문의내용1-Pg", createdAt: now, updatedAt: now },
            { courseID: "3", cmDtCd: "2", writerID:"3", title:"문의2-Pg",content:"문의내용2-Pg", createdAt: now, updatedAt: now },
            { courseID: "3", cmDtCd: "2", writerID:"6", title:"문의3-Pg",content:"문의내용3-Pg", createdAt: now, updatedAt: now },
            { courseID: "3", cmDtCd: "2", writerID:"6", title:"문의4-Pg",content:"문의내용4-Pg", createdAt: now, updatedAt: now },
            { courseID: "3", cmDtCd: "2", writerID:"9", title:"문의5-Pg",content:"문의내용5-Pg", createdAt: now, updatedAt: now },
            { courseID: "3", cmDtCd: "2", writerID:"9", title:"문의6-Pg",content:"문의내용6-Pg", createdAt: now, updatedAt: now },

            { courseID: "5", cmDtCd: "1", writerID:"12", title:"[바리스타1급]공지1-원두 안내",content:"[바리스타1급]공지내용1-에티오피아 원두\n강배전,약배전으로 나올 가능성이 높습니다.\n예상으로만 참고해주세요.", createdAt: now, updatedAt: now },
            { courseID: "5", cmDtCd: "1", writerID:"12", title:"[바리스타1급]공지2-라떼아트 안내",content:"[바리스타1급]공지내용2-라떼아트는 뫄뫄 모양으로\n진행될 예정입니다. 관련하여 솨솨로 연습해주세요.", createdAt: now, updatedAt: now },
            { courseID: "5", cmDtCd: "1", writerID:"12", title:"[바리스타1급]공지3-시험 의상 안내",content:"[바리스타1급]공지내용3-의상은\n흰색 상의, 검정색 하의, 검정 앞치마가 필수입니다.\n지켜지지 않을 시 시험 불참이 될 수 있으니 확인해주세요.", createdAt: now, updatedAt: now },

            { courseID: "5", cmDtCd: "2", writerID:"1", title:"문의1 바리스타1급-강의실 문의",content:"문의내용1 바리스타1급-강의실이 103호인거로 아는데 어디 건물로 가야하나요?", createdAt: now, updatedAt: now },
            { courseID: "5", cmDtCd: "2", writerID:"4", title:"문의2 바리스타1급-준비물",content:"문의내용2 바리스타1급-필기 시험 합격했는데 실기 시험 준비물 알려주세요", createdAt: now, updatedAt: now },
            { courseID: "5", cmDtCd: "2", writerID:"7", title:"문의3 바리스타1급-기타",content:"문의내용3 바리스타1급-다른 질문인데 뫄뫄해서 솨솨는 어디로 문의해야하나요", createdAt: now, updatedAt: now },

            { courseID: "9", cmDtCd: "1", writerID:"13", title:"[재봉틀 초급]공지1-재봉틀 종류",content:"[재봉틀 초급]공지내용1-재봉틀은 기능이 많을 수록 비쌉니다.\n특히 자동 실 끊기 기능이 있다면 가격이 확 올라가니 참고해주세요.", createdAt: now, updatedAt: now },
            { courseID: "9", cmDtCd: "1", writerID:"13", title:"[재봉틀 초급]공지2-원단 구매처",content:"[재봉틀-초급]공지내용2-동대문시장을 추천합니다.\n인터넷 쇼핑몰도 괜찬습니다.", createdAt: now, updatedAt: now },
            { courseID: "9", cmDtCd: "1", writerID:"13", title:"[재봉틀 초급]공지3-강의비 인상",content:"[재봉틀-초급]공지내용3-부자재비 가격\n인상으로 강의비가 인상되었습니다.\n3만원 올랐으니 참고해주세요", createdAt: now, updatedAt: now },

            { courseID: "9", cmDtCd: "2", writerID:"7", title:"문의1 미싱초급-부자재비",content:"문의내용1 미싱초급-부자재에 다른 걸 더 쓰고 싶은데 추가로 가져가면 되나요?", createdAt: now, updatedAt: now },
            { courseID: "9", cmDtCd: "2", writerID:"7", title:"문의2 미싱초급-미싱 바늘",content:"문의내용2 미싱초급-바늘이 잘 부러져버려요. 유투브 봤는데도 어려워요.", createdAt: now, updatedAt: now },
            { courseID: "9", cmDtCd: "2", writerID:"8", title:"문의3 미싱초급-1대1 강습",content:"문의내용3 미싱초급-3인 수업 말고 1대1일 원데이 클래스도 있는지 궁금해요", createdAt: now, updatedAt: now },
          ]).then(() => {
            console.log("post seed 삽입 완료");

            queryInterface.bulkInsert("comment", [
              // 댓글 목록
              { courseID: "1", postID: "11", writerID:"11",content:"문의1 iOS댓글1-다른 강좌는 변동없습니다.", createdAt: now, updatedAt: now },
              { courseID: "1", postID: "11", writerID:"11",content:"문의1 iOS댓글2-소개로 수강생 등록시 할인 1만원 가능합니다.", createdAt: now, updatedAt: now },
              { courseID: "1", postID: "11", writerID:"11",content:"문의1 iOS댓글3-추가 문의가 있다면 찾아와주세요", createdAt: now, updatedAt: now },
              { courseID: "1", postID: "12", writerID:"11",content:"문의2 iOS댓글4-201호는 대관 가능 호실입니다.", createdAt: now, updatedAt: now },
              { courseID: "1", postID: "12", writerID:"11",content:"문의2 iOS댓글5-202호를 독서실로 사용해주세요", createdAt: now, updatedAt: now },
              { courseID: "1", postID: "12", writerID:"11",content:"문의2 iOS댓글6-추가 문의가 있다면 찾아와주세요", createdAt: now, updatedAt: now },
              { courseID: "1", postID: "13", writerID:"11",content:"문의3 iOS댓글7-진단서 말고 세부영수증만 떼와도 됩니다.", createdAt: now, updatedAt: now },

              { courseID: "2", postID: "26", writerID:"11",content:"문의1 JS댓글1-제가 아는 분은 Atom 쓰시더라고요.", createdAt: now, updatedAt: now },
              { courseID: "2", postID: "26", writerID:"11",content:"문의1 JS댓글2-다른거 쓸게 있나요..?", createdAt: now, updatedAt: now },
              { courseID: "2", postID: "26", writerID:"11",content:"문의1 JS댓글3-웬만해선 VS Code 사용해주세요.", createdAt: now, updatedAt: now },
              { courseID: "2", postID: "27", writerID:"11",content:"문의2 JS댓글1-Live Server는 꼭.", createdAt: now, updatedAt: now },
              { courseID: "2", postID: "27", writerID:"11",content:"문의2 JS댓글2-\nBracket Pair Colorizer : block이 구분 안될때, 괄호마다 색깔별로 지정해서 편하게 볼수 있게 해줌\nindent-rainbow : 들여쓰기 구역을 rainbow highlight로 명확하게 보여줌\nAuto Rename Tag : 태그 수정(<h1>만 수정해도 </h1>도 자동수정됨) start tag, end tag를 자동으로 변경", createdAt: now, updatedAt: now },
              { courseID: "2", postID: "28", writerID:"11",content:"문의3 JS댓글1-기본 중의 기본", createdAt: now, updatedAt: now },
              { courseID: "2", postID: "28", writerID:"11",content:"문의3 JS댓글2-모르면 개발 불가", createdAt: now, updatedAt: now },

              { courseID: "5", postID: "44", writerID:"12",content:"문의1 - 바리스타1급 댓글1", createdAt: now, updatedAt: now },
              { courseID: "5", postID: "44", writerID:"12",content:"문의1 - 바리스타1급 댓글2", createdAt: now, updatedAt: now },
              { courseID: "5", postID: "44", writerID:"12",content:"문의1 - 바리스타1급 댓글3", createdAt: now, updatedAt: now },
              { courseID: "5", postID: "45", writerID:"12",content:"문의2 - 바리스타1급 댓글1", createdAt: now, updatedAt: now },
              { courseID: "5", postID: "45", writerID:"12",content:"문의2 - 바리스타1급 댓글1", createdAt: now, updatedAt: now },
              { courseID: "5", postID: "46", writerID:"12",content:"문의3 - 바리스타1급 댓글1", createdAt: now, updatedAt: now },
              { courseID: "5", postID: "46", writerID:"12",content:"문의3 - 바리스타1급 댓글1", createdAt: now, updatedAt: now },

              { courseID: "9", postID: "50", writerID:"13",content:"문의1의 댓글1- 재봉틀 초급", createdAt: now, updatedAt: now },
              { courseID: "9", postID: "50", writerID:"13",content:"문의1의 댓글2- 재봉틀 초급", createdAt: now, updatedAt: now },
              { courseID: "9", postID: "50", writerID:"13",content:"문의1의 댓글3- 재봉틀 초급", createdAt: now, updatedAt: now },
              { courseID: "9", postID: "51", writerID:"13",content:"문의2 댓글1- 재봉틀 초급", createdAt: now, updatedAt: now },
              { courseID: "9", postID: "51", writerID:"13",content:"문의2 댓글2- 재봉틀 초급", createdAt: now, updatedAt: now },
              { courseID: "9", postID: "52", writerID:"13",content:"문의3 - 재봉틀 초급1", createdAt: now, updatedAt: now },
              { courseID: "9", postID: "52", writerID:"13",content:"문의3 - 재봉틀 초급2", createdAt: now, updatedAt: now },

            ]).then(() => {
              console.log("comment seed 삽입 완료");

              
              // storage account
              queryInterface.bulkInsert("attachedFile", [
                // 댓글 목록
                { fileName: "default1111.jpg", postID: "12", createdAt: now, updatedAt: now },
                { fileName: "default2222.jpg", postID: "12", createdAt: now, updatedAt: now },
                { fileName: "default3333.jpg", postID: "12", createdAt: now, updatedAt: now },
              ]).then(() => {
                console.log("attachedFile seed 삽입 완료");
              }).catch((error) => {
                console.error("Error syncing the comment:", error);
              });


              // 다음 샘플 데이터 추가 시, 최종 then 에 넣어야함...

          }).catch((error) => {
            console.error("Error syncing the comment:", error);
          }); // 댓글 END
        }).catch((error) => {
          console.error("Error syncing the post:", error);
        }); // 게시글 END
      }).catch((error) => {
        console.error("Error syncing the student:", error);
      }); // 강좌 <-> 학생 END
    }).catch((error) => {
      console.error("Error seed course :", error);
    }); // 강좌 END
  }).catch((error) => {
    console.error("Error syncing the user:", error);
  }); // 사용자 END
};

module.exports = sync;
