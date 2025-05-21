// /* global openNav, closeNav */
// function openNav() {
//     document.getElementById("sidebar").style.width = "25%";
//     document.getElementById("main-div").style.marginRight = "25%";
//     document.getElementById("translucent-background").hidden = false;
// }

// function closeNav() {
//     document.getElementById("sidebar").style.width = "0";
//     document.getElementById("main-div").style.marginRight = "0";
//     document.getElementById("translucent-background").hidden = true;
// }
window.openNav = function () {
    document.getElementById("sidebar").style.width = "25%";
    document.getElementById("main-div").style.marginRight = "25%";
    document.getElementById("translucent-background").hidden = false;
};

window.closeNav = function () {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("main-div").style.marginRight = "0";
    document.getElementById("translucent-background").hidden = true;
};
