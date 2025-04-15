import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

// Sửa lại phạm vi ngày hợp lệ từ 1/1/2024 đến nay
const isValidDate = (date) => {
  const startDate = moment("2024-01-01");
  const endDate = moment(); // Ngày hiện tại
  return date.isBetween(startDate, endDate, null, "[]");
};

const markCommit = async (date) => {
  let data = [];

  try {
    data = await jsonfile.readFile(path);
  } catch (err) {
    console.log("File not found, creating new one...");
  }

  data.push({ date: date.toISOString() });

  await jsonfile.writeFile(path, data);

  const git = simpleGit();
  await git.add([path]);
  await git.commit(date.toISOString(), { "--date": date.toISOString() });
};

const makeCommits = async (n) => {
  const git = simpleGit();

  for (let i = 0; i < n; i++) {
    const randomDays = random.int(0, 6);
    const randomWeeks = random.int(0, 54 * 4);

    const randomDate = moment("2024-01-01")
      .add(randomWeeks, "weeks")
      .add(randomDays, "days");

    if (isValidDate(randomDate)) {
      console.log(`Creating commit: ${randomDate.toISOString()}`);
      await markCommit(randomDate);
    } else {
      console.log(`Invalid date: ${randomDate.toISOString()}, skipping...`);
    }
  }

  console.log("Pushing all commits...");
  await git.push("origin", "main");
};

makeCommits(6000);
