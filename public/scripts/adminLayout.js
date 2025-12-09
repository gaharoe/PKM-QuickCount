function $id(id) {
  return document.getElementById(id);
}
function $qAll(q) {
  return document.querySelectorAll(q);
}
function $q(q) {
  return document.querySelector(q);
}
function $class(classname) {
  return document.getElementsByClassName(classname);
}

function toggleSlider() {
  $id("sidebar").classList.toggle("w-55");
  $id("sidebar").classList.toggle("w-15");
  
  const navText = Array.from($class("nav-text"));
  navText.forEach(async (el) => {
    if (!el.classList.contains("hidden")) {
      el.classList.toggle("hidden");
    } else {
      setTimeout(() => {
        el.classList.toggle("hidden");
      }, 200);
    }
  });
}

$("#nav-btns").click(function (e) {
  e.preventDefault();
  const link = e.target.closest("a");
  if (link && link.getAttribute("href").startsWith("/")) {
    const endpoint = link.getAttribute("href");
    let page = endpoint.split("/")[2];
    page = page.charAt(0).toUpperCase() + page.slice(1);
    let state = { page };
    $("#position").text(page);
    $.ajax({
      type: "GET",
      url: endpoint,
      success: function (response) {
        $("#content").html(response);
        history.pushState(state, page, endpoint);
      },
    });
  }
});

$("#logout").click(function (e) {
  e.preventDefault();
  fetch("/logout", { method: "POST" })
    .then((data) => data.json())
    .then(() => (window.location.href = "/admin/login"));
});

// bikin tooltip element
const tooltip = document.createElement("div");
tooltip.className = "fixed px-2 py-1 bg-slate-50 text-stone-800 text-xs font-light shadow shadow-lg rounded-lg pointer-events-none whitespace-nowrap opacity-0 transition-opacity";
document.body.appendChild(tooltip);

document.querySelectorAll(".has-tooltip").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    tooltip.textContent = el.dataset.tip;
    tooltip.style.left = e.clientX + 12 + "px";
    tooltip.style.top = e.clientY + 12 + "px";
    tooltip.classList.remove("opacity-0");
    tooltip.classList.add("opacity-100");
  });

  el.addEventListener("mouseleave", () => {
    tooltip.classList.remove("opacity-100");
    tooltip.classList.add("opacity-0");
  });
});
