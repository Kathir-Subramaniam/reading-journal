console.log("Hello World")

function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("main-div").style.marginRight = "250px";
    document.getElementById("translucent-background").hidden = false;
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("main-div").style.marginRight = "0";
    document.getElementById("translucent-background").hidden = true;
}