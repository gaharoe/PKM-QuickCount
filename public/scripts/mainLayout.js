$("#slider").click(function (e) { 
    e.preventDefault();
    $("#sidebar").toggleClass("-ml-64");
    $("#top-bar").toggleClass("left-64");
    $("#top-bar").toggleClass("left-0");
});

$("#nav-btns").click(function (e) { 
    e.preventDefault();
    const link = e.target.closest("a");
    const endpoint = link.getAttribute("href");
    let page = endpoint.split("/")[1];
    page = page.charAt(0).toUpperCase() + page.slice(1);
    if(link && link.getAttribute("href").startsWith("/")){
        let state = {page}
        history.pushState(state, page, endpoint);
        $("#position").text(page);
        $.ajax({
            type: "GET",
            url: endpoint,
            success: function (response) {
                $("#content").html(response);
            }
        });
    }
});