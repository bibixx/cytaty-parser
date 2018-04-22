const R = require("ramda");

const fs = require("fs");
const path = require("path");
const resolve = dir => path.join(__dirname, "..", dir);

const { default: quotes } = require("../quotes.js")
const { default: teachers } = require("../teachers.js")
const he = require('he');

const main = () => {
  const combine = R.curry((a1, a2) => [a1, a2]);

  const processHtml = (text) => he.decode(text.replace(/<br>/g, "   "))

  const start = 3;

  const findTeacher = (id) => "– " + teachers[2].data.find(({ id: teacherId }) => id === teacherId).name;

  const generateCSVQuote = ({ id, text, info, teacher_id }) =>
    R.join(",", [
      `"${id}"`,
      "„",
      "”",
      `"${processHtml(text)}"`,
      `"${processHtml(info)}"`,
      `"${findTeacher(teacher_id)}"`
    ]);

  const indexEven = (v, i) => (
    R.pipe(
      R.mathMod(R.__, 2),
      R.equals(0)
    )(i)
  );

  const createHeader = () => {
    const props = ["id", "q1", "q2", "text", "info", "teacher"];
    return ["\"page\"" + "," + props.map(p => `"${p}"`).join(",") + "," + props.map(p => `"${p}2"`).join(",")]
  }

  const out = R.pipe(
    R.prop(2),
    R.prop("data"),

    R.converge(R.pipe(combine, R.transpose), [
      R.addIndex(R.filter)(indexEven),
      R.addIndex(R.filter)(R.pipe(indexEven, R.not))
    ]),

    R.addIndex(R.map)( (v, i) => {
      return R.pipe(
        R.map(
          R.pipe(
            generateCSVQuote,
          )
        ),
        R.join(","),
        R.concat(i + 3 + ","),
      )(v)
    } ),

    R.concat([createHeader()]),
    R.join("\n")
  )(quotes);

  return out;
}

exports.default = {
  main,
};