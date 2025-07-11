fetch("http://coni.iptime.org:4000/api/test")
  .then((res) => res.json())
  .then((data) => {
    document.getElementById(
      "result"
    ).innerText = `응답: ${data.msg} / 시간: ${data.time}`;
  })
  .catch((err) => {
    console.error(err);
    document.getElementById("result").innerText = "API 호출 오류 발생";
  });
