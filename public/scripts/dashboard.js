function $id(id) { return document.getElementById(id); }
const tpsColors = ["rgba(220, 38, 38, 0.6)", "rgba(16, 185, 129, 0.6)", "rgba(255, 197, 89,0.6)"];

function loadDashboardCharts() {
    if(window.grafikPolling || window.grafikTps){
        window.grafikPolling.destroy();
        window.grafikTps.destroy();
    }

    window.grafikPolling = new Chart($id("grafik-polling"), {
        type: "bar",
        data: {
            labels: [],
            datasets: [
                {
                    data: [],
                    // backgroundColor: "#3B82F6", // biru elegan
                    // borderColor: "#2563EB",     // biru lebih tua buat aksen
                    borderWidth: 1,
                    borderRadius: 6,            // sedikit rounded biar halus
                    hoverBackgroundColor: "#60A5FA", // biru muda saat hover
                    barPercentage: 0.5
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Grafik Polling Suara",
                    color: "#1E293B",
                    font: { size: 16, weight: "bold" },
                    padding: { top: 10, bottom: 20 }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: "#1E293B",
                    titleColor: "#E2E8F0",
                    bodyColor: "#E2E8F0",
                    padding: 10
                }
            },
            scales: {
                x: {
                    ticks: { color: "#334155", font: { size: 13 } },
                    grid: { color: "#E2E8F0" }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: "#334155", font: { size: 13 } },
                    grid: { color: "#E2E8F0" }
                }
            },
            animation: {
                duration: 1500,
                easing: "easeInOutCirc" // efek mantul pas muncul
            }
        }
    });

    window.grafikTps = new Chart($id("grafik-tps"), {
        type: "bar",
        data: {
            labels: [],
            datasets: [
                {
                    data: [],
                    // borderWidth: 1,
                    hoverOffset: 12,
                    borderRadius: 10,
                }
            ]
        },
        options: {
            indexAxis: "y",
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Perolehan Suara Tiap TPS",
                    color: "#1E293B",
                    font: { size: 16, weight:"bold" },
                    padding: { top: 10, bottom: 20 }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: "#1E293B",
                    titleColor: "#E2E8F0",
                    bodyColor: "#E2E8F0",
                    padding: 10
                }
            },
            animation: {
                duration: 1500,
            }
        }
    });

    $id("table-tps").innerHTML = `
        <tr class="bg-sky-900 text-neutral-200 h-6">
            <td width="40" class="text-center">#</td>
            <td>Nama</td>
            <td width="50">Suara</td>
            <td width="100">Status</td>
        </tr>
    `;

    socket.emit("admin-dashboard-request-charts");
    socket.off("admin-polling-update");
    socket.off("admin-tps-update");
    socket.on("admin-polling-update", (datas) => {
        window.grafikPolling.data.labels = datas.lables;
        window.grafikPolling.update();
        setTimeout(()=>{
            window.grafikPolling.data.datasets[0].data = datas.data;
            window.grafikPolling.update();
        },1);
    });

    socket.on("admin-tps-update", (datas) => {
        datas.labels.forEach((label, index) => {
            let status = datas.status[index]==0 ? ["offline", "bg-red-600"] : 
                datas.status[index]==1 ? ["online", "bg-emerald-500"] : 
                    ["pending", "bg-yellow-500"];
            
            let tableRow = document.createElement("tr");
            tableRow.className = `h-6 bg-slate-${index%2==0? "300":"200"}`;
            tableRow.innerHTML = `
                <td class="text-center">${index+1}</td>
                <td>${label}</td>
                <td>${datas.data[index]}</td>
                <td>
                    <span class="${status[1]} flex w-fit items-center gap-2 text-white pl-3 pr-5 py-[1px] rounded-full">
                        <div class="w-1 h-1 bg-white rounded-full"></div>
                        ${status[0]}
                    </span>
                </td>
            `; 
            $id("table-tps").appendChild(tableRow);
        });
        window.grafikTps.data.labels = datas.labels;
        window.grafikTps.data.datasets[0].backgroundColor = (datas.status).map(status => tpsColors[status]);
        window.grafikTps.update();
        setTimeout(()=>{
            window.grafikTps.data.datasets[0].data = datas.data;
            window.grafikTps.update();
        }, 1)
    });

    window.addEventListener("load", () => {
        window.grafikPolling.reset();
        window.grafikPolling.update();
        window.grafikTps.reset();
        window.grafikTps.update();
    });
}
