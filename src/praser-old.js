const fs = require("fs");
const { default: quotes } = require("./quotes2.js")
const { default: teachers} = require("./teachers.js")
const he = require('he');

const processHtml = (text) => he.decode(text.replace(/<br>/g, "   "))

const start = 3;

const findTeacher = (id) => "– " + teachers[2].data.find(({id: teacherId}) => id===teacherId).name;

exports.default = () => {
  let data = quotes[2].data.map(({ id, text, info, teacher_id }) =>
    [`"${id}"`, "„", "”", `"${processHtml(text)}"`, `"${processHtml(info)}"`, `"${findTeacher(teacher_id)}"`]
      .join(","));

  if (data.length % 2 !== 0) {
    data.push('"","","","","",""')
  }

  const dataFlat = data.reduce((prev, curr, i) => {
    if (i % 2 !== 0) {
      const prevWithoutLast = prev.slice(0, -1);
      const lastFromPrev = prev.slice(-1);

      const currentLine = (start + (i - 1) / 2) + "," + lastFromPrev + "," + curr;

      return [...prevWithoutLast, currentLine];
    }

    return [...prev, curr];
  }, [])

  const props = ["id", "q1", "q2", "text", "info", "teacher"];

  const header = "\"page\"" + "," + props.map(p => `"${p}"`).join(",") + "," + props.map(p => `"${p}2"`).join(",")

  // fs.writeFile("out.csv", [header, ...dataFlat].join("\n"), 'utf16le', () => { });
  fs.writeFileSync("out.csv", [header, ...dataFlat].join("\n"), 'utf8');
}