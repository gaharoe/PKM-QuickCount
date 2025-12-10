function editCandidate() {
    const input = document.getElementById("imgInput");
    const preview = document.getElementById("preview");
    const imagePlaceholder = $id("image-placeholder");
    const form = $id("form-candidate");
    
    input.addEventListener("change", () => {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePlaceholder.classList.add("hidden")
            preview.src = e.target.result;
            preview.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    });
    
    $id("submit").addEventListener("click", async (e) => {
        e.preventDefault;
        const file = input.files[0];
        const fd = new FormData(form);
        
        fd.append("foto", file);
        
        console.log(fd.get("nama"), fd.get("kelas"), fd.get("visi"), fd.get("misi"), fd.get("foto"));
        // const req = await fetch("/forms/candidate/edit", {
        //     method: "POST",
        //     body: fd,
        // });
        // const data = await req.json();
        // if (data.result) {
        //     Swal.fire({
        //         icon: "success",
        //         title: "Sukses",
        //         text: "Data berhasil diubah",
        //     }).then(res => window.location.href = "/admin/candidate");
        // } else {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: "Terjadi kesalahan pada server, coba lagi yaaa...",
        //     });
        // }
    });
    $id("cancel").addEventListener("click", () => { window.location.href = "/admin/candidate" });
}
