$("#slider").click(function (e) { 
    e.preventDefault();
    $("#sidebar").toggleClass("-ml-64");
    $("#top-bar").toggleClass("left-64");
    $("#top-bar").toggleClass("left-0");
});

$("#nav-btns").click(function (e) { 
    e.preventDefault();
    const link = e.target.closest("a");
    if(link && link.getAttribute("href").startsWith("/")){
        const endpoint = link.getAttribute("href");
        let page = endpoint.split("/")[2];
        page = page.charAt(0).toUpperCase() + page.slice(1);
        let state = {page}
        $("#position").text(page);
        $.ajax({
            type: "GET",
            url: endpoint,
            success: function (response) {
                $("#content").html(response);
                history.pushState(state, page, endpoint);
            }
        });
    }
});

$("#logout").click(function (e) { 
    e.preventDefault();
    Swal.fire({
        text: "Keluar dari "+tpsID+" ?",
        icon: "question",
        showCancelButton: true
    }).then(res => {
        if(res.value){
            $.ajax({
                type: "POST",
                url: "/logout",
                contentType: "application/json",
                data: JSON.stringify({tps: tpsID}),
                success: function () {
                    window.location.href = "/login"
                }
            });
        }
    });
});

