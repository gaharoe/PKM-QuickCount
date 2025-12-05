function voteCandidate(candidateID){
    const audio = new Audio("/audio/kaget.mp3");
    Swal.fire({
        title: 'Anda yakin?',
        text: "Anda akan memilih " + candidateID,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, vote!'
    }).then((result) => {
        if (result.isConfirmed) {
            socket.emit("tps-vote", {candidateID, tpsID})
            audio.play();
            Swal.fire({
                text: "Vote berhasil",
                icon: "success",
                showConfirmButton: false,
                timer: 2000
            });

        }
    });
}

function tpsVote(id) {
    tpsID = id;
    $id("position").innerText = id;
    socket.emit("tps-logged", id);
    socket.on("msg", (d) => console.log(d));
}