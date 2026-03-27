const Configuration = {
  // 기본 무시 규칙(merge commit 등)은 유지
  defaultIgnores: true,
  // "@commitlint/config-conventional" plugin 사용 안함 (rules 내 규칙만 적용)
  extends: [],

  rules: {
    // ===== header > type =====
    // type 입력 필수
    "type-empty": [2, "never"],
    // 허용 목록과 작성 형태 동일해야함
    "type-case": [0],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "design",
        "!BREAKING CHANGE",
        "!HOTFIX",
        "style",
        "refactor",
        "comment",
        "docs",
        "test",
        "chore",
        "rename",
        "remove",
      ],
    ],

    // ===== header > subject =====
    // subject 입력 필수
    "subject-empty": [2, "never"],
    // 제목 대소문자 제한 없음 (첫 글자 대/소문자 모두 허용)
    "subject-case": [0],
    // 제목 길이 50자 이내
    "subject-max-length": [2, "always", 50],
    // 제목 끝에 '.' 금지 (!, ?는 별도 규칙 설정 없음)
    "subject-full-stop": [2, "never", "."],

    // ===== body =====
    // body 선택적 입력 허용
    "body-empty": [0],
    // body 길이 72자 이내
    "body-max-line-length": [2, "always", 72],
  },
};

export default Configuration;
