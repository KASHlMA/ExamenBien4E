async function createReport() {
    const productName = document.getElementById("productName").value;
    const problemDescription = document.getElementById("problemDescription").value;
    const reportDate = document.getElementById("reportDate").value;
    const msg = document.getElementById("create-msg");

    msg.innerHTML = "";

    if(!productName || !problemDescription || !reportDate) {
        msg.innerHTML = "<span class='error'>Todos los campos son obligatorios</span>";
        return;
    }

    try {
        const response = await fetch("/reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productName, problemDescription, reportDate })
        });

        if (response.ok) {
            const data = await response.json();
            msg.innerHTML = "<span class='success'>Reporte creado con ID: " + data.id + "</span>";
            document.getElementById("productName").value = "";
            document.getElementById("problemDescription").value = "";
            document.getElementById("reportDate").value = "";
        } else {
            const errorText = await response.text();
            msg.innerHTML = "<span class='error'>" + errorText + "</span>";
        }
    } catch (error) {
        msg.innerHTML = "<span class='error'>Error de conexión</span>";
    }
}

async function searchReports() {
    const name = document.getElementById("searchName").value;
    const container = document.getElementById("search-result");
    container.innerHTML = "";

    if(!name) {
        container.innerHTML = "<span class='error'>Ingresa un nombre para buscar</span>";
        return;
    }

    try {
        const response = await fetch("/reports/search?name=" + name);

        if (!response.ok) {
            const errorText = await response.text();
            container.innerHTML = "<p class='error'>" + errorText + "</p>";
            return;
        }

        const reports = await response.json();

        reports.forEach(report => {
            container.innerHTML += renderCard(report);
        });

    } catch (error) {
        container.innerHTML = "<span class='error'>Error al buscar</span>";
    }
}

async function resolveReport() {
    const id = document.getElementById("resolveId").value;
    const msg = document.getElementById("resolve-msg");
    msg.innerHTML = "";

    if (!id) {
        msg.innerHTML = "<span class='error'>Ingresa un ID</span>";
        return;
    }

    try {
        const response = await fetch("/reports/" + id + "/resolve", {
            method: "PATCH"
        });

        if (response.ok) {
            const updatedReport = await response.json();
            msg.innerHTML = "<span class='success'>¡Reporte ID " + updatedReport.id + " marcado como resuelto!</span>";
            loadReports();
        } else {
            const errorText = await response.text();
            msg.innerHTML = "<span class='error'>" + errorText + "</span>";
        }
    } catch (error) {
        msg.innerHTML = "<span class='error'>Error de conexión</span>";
    }
}

async function loadReports() {
    const container = document.getElementById("report-list");
    container.innerHTML = "Cargando...";

    try {
        const response = await fetch("/reports");

        if (!response.ok) {
            container.innerHTML = "<p class='error'>Error al cargar reportes</p>";
            return;
        }

        const reports = await response.json();
        container.innerHTML = "";

        if (reports.length === 0) {
            container.innerHTML = "<p>No hay reportes registrados.</p>";
            return;
        }

        reports.forEach(report => {
            container.innerHTML += renderCard(report);
        });

    } catch (error) {
        container.innerHTML = "<p class='error'>Error de conexión</p>";
    }
}

function renderCard(report) {
    const estado = report.resolved ? "✅ Resuelto" : "❌ Pendiente";
    const claseColor = report.resolved ? "resolved-true" : "resolved-false";

    return `
        <div class="user-card ${claseColor}">
            <b>ID:</b> ${report.id} <br>
            <b>Producto:</b> ${report.productName} <br>
            <b>Problema:</b> ${report.problemDescription} <br>
            <b>Fecha:</b> ${report.reportDate} <br>
            <b>Estado:</b> ${estado}
        </div>
    `;
}