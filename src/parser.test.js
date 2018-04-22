const fs = require("fs");
const he = require("he");
const rimraf = require("rimraf");
const parse = require('csv-parse/lib/sync');
const { default: rawQuotes } = require("../quotes.js");
const { default: rawTeachers } = require("../teachers.js");
const { main } = require("./parser.js").default;

const path = require("path");
const resolve = dir => path.join(__dirname, "..", dir);

let csvFile;
let splitCsv;

const fileName = resolve("out.csv");

const quotes = rawQuotes[2].data;
const findTeacher = (id) => rawTeachers[2].data.find(({ id: teacherId }) => id === teacherId).name;
const processHtml = (text) => he.decode(text.replace(/<br>/g, "   "))


describe("Parser", () => {
  const csvFile = main();
  const splitCsv = csvFile.split("\n");

  test("CSV should have a header", () => {
    expect(splitCsv[0]).toBe("\"page\",\"id\",\"q1\",\"q2\",\"text\",\"info\",\"teacher\",\"id2\",\"q12\",\"q22\",\"text2\",\"info2\",\"teacher2\"")
  })

  describe("CSV should have a proper structure", () => {
    const [head, ...tail] = splitCsv;

    const [line] = parse(tail[0], { auto_parse: true });

    test("1st argument is 3", () => {
      expect(line[0]).toBe(3);
    })

    test("3rd argument is a '„'", () => {
      expect(line[2]).toBe("„");
    })

    test("4th argument is a '”'", () => {
      expect(line[3]).toBe("”");
    })

    test("9th argument is a '„'", () => {
      expect(line[8]).toBe("„");
    })

    test("10th argument is a '”'", () => {
      expect(line[9]).toBe("”");
    })

    describe("Arguments match input", () => {
      test("2nd argument", () => {
        expect(String(line[1])).toBe(quotes[0].id);
      });

      test("5th argument", () => {
        expect(String(line[4])).toBe(processHtml(quotes[0].text));
      });

      test("6th argument", () => {
        expect(String(line[5])).toBe(quotes[0].info);
      });

      test("7th argument", () => {
        expect(String(line[6])).toBe("– " + findTeacher(quotes[0].teacher_id));
      });


      test("8nd argument", () => {
        expect(String(line[7])).toBe(quotes[1].id);
      });

      test("11th argument", () => {
        expect(String(line[10])).toBe(processHtml(quotes[1].text));
      });

      test("12th argument", () => {
        expect(String(line[11])).toBe(quotes[1].info);
      });

      test("13th argument", () => {
        expect(String(line[12])).toBe("– " + findTeacher(quotes[1].teacher_id));
      });
    })
  })

  test("It has the correct number of elements", () => {
    expect(splitCsv.length - 1).toBe(Math.ceil(quotes.length / 2))
  })
});

afterAll(() => {
  // rimraf.sync(fileName);  
})