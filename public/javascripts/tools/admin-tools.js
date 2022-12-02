let pendinggames = document.querySelectorAll(
  "div.pending-games .mainlistedGame"
);
let postedgames = document.querySelectorAll("div.posted-games .mainlistedGame");
function showApproved() {
  console.log("approved");
  pendinggames.forEach((element) => {
    element.style.display = "none";
  });
  postedgames.forEach((element) => {
    element.style.display = "";
  });
}
function showPending() {
  console.log("pending");
  pendinggames.forEach((element) => {
    element.style.display = "";
  });
  postedgames.forEach((element) => {
    element.style.display = "none";
  });
}
let Approvedbutton = document.querySelector(".createbtnright");
Approvedbutton.addEventListener("click", showApproved);

let pendingbutton = document.querySelector(".createbtnleft");
pendingbutton.addEventListener("click", showPending);

// let pendinggames = document.querySelectorAll("div.pending-games .listedGame");
// let postedgames = document.querySelectorAll("div.posted-games .listedGame");
// function showApproved() {
//   console.log("approved");
//   pendinggames.forEach((element) => {
//     element.style.display = "none";
//   });
//   postedgames.forEach((element) => {
//     element.style.display = "";
//   });
// }
// function showPending() {
//   console.log("pending");
//   pendinggames.forEach((element) => {
//     element.style.display = "";
//   });
//   postedgames.forEach((element) => {
//     element.style.display = "none";
//   });
// }
// let Approvedbutton = document.querySelector(".creatorapprovedbtn");
// Approvedbutton.addEventListener("click", showApproved);

// let pendingbutton = document.querySelector(".creatorpendingbtn");
// pendingbutton.addEventListener("click", showPending);
