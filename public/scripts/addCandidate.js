function addCandidate() {
    const input = document.getElementById("imgInput");
    const preview = document.getElementById("preview");
    const imageContaier = $id("image-container");
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
        if (fd.get("nama") == "" || fd.get("kelas") == "" || fd.get("visi") == "" || fd.get("misi") == "" || !file) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Isi data kandidat dengan lengkap yaaa...",
            });
            return;
        }

        fd.append("foto", file);

        const req = await fetch("/forms/candidate/add", {
            method: "POST",
            body: fd,
        });
        const data = await req.json();
        if (data.result == 1) {
            Swal.fire({
                icon: "success",
                title: "Sukses",
                text: "Data berhasil ditambahkan",
            }).then(res => window.location.href = "/admin/candidate");
        } else if (data.result == 2) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Kandidat Sudah terdaftar",
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Format gambar tidak sesuai, gunakan format JPG, JPEG, atau PNG yaaa...",
            });
        }
    });
    $id("cancel").addEventListener("click", () => { window.location.href = "/admin/candidate" });
}
