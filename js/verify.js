/* =========================================================
   BASEMATE CERTIFICATE VERIFICATION ENGINE
   Mishita Computers Centre
   ========================================================= */


/* =========================================================
   CLOUDFLARE WORKER API
   ========================================================= */

const VERIFICATION_API =
    "https://basemate-certificate-verification.mishitacomputers.workers.dev/api/verify";


/* =========================================================
   PAGE START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const token =
            params.get("token");


        if (
            token &&
            token.trim() !== ""
        ) {

            verifyCertificate(
                token.trim()
            );

        }
        else {

            showNoToken();

        }

    }
);


/* =========================================================
   VERIFY CERTIFICATE ONLINE
   ========================================================= */

async function verifyCertificate(token) {

    showChecking(token);


    try {

        const response =
            await fetch(
                VERIFICATION_API +
                "?token=" +
                encodeURIComponent(token),
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    },

                    cache: "no-store"
                }
            );


        let data;


        try {

            data =
                await response.json();

        }
        catch (jsonError) {

            throw new Error(
                "Invalid response received from verification server."
            );

        }


        /* =================================================
           CERTIFICATE NOT FOUND
           ================================================= */

        if (
            response.status === 404 ||
            data.status === "NOT_FOUND"
        ) {

            showNotFound(token);

            return;

        }


        /* =================================================
           SERVER ERROR
           ================================================= */

        if (
            !response.ok ||
            data.success !== true
        ) {

            showVerificationError();

            return;

        }


        /* =================================================
           CERTIFICATE FOUND
           ================================================= */

        displayCertificate(
            token,
            data.certificate
        );


    }
    catch (error) {

        console.error(
            "Certificate verification error:",
            error
        );

        showVerificationError();

    }

}


/* =========================================================
   CHECKING STATE
   ========================================================= */

function showChecking(token) {


    const icon =
        document.getElementById(
            "verificationIcon"
        );


    const title =
        document.getElementById(
            "statusTitle"
        );


    const description =
        document.getElementById(
            "statusDescription"
        );


    icon.className =
        "verification-icon checking";


    icon.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i>';


    title.textContent =
        "Checking Certificate...";


    description.textContent =
        "Please wait while we securely verify this certificate with the BaseMate online verification database.";


    document.getElementById(
        "verificationToken"
    ).textContent =
        token;


    document.getElementById(
        "verificationReference"
    ).style.display =
        "block";

}


/* =========================================================
   VALID / REVOKED CERTIFICATE DISPLAY
   ========================================================= */

function displayCertificate(
    token,
    certificate
) {


    const icon =
        document.getElementById(
            "verificationIcon"
        );


    const title =
        document.getElementById(
            "statusTitle"
        );


    const description =
        document.getElementById(
            "statusDescription"
        );


    const details =
        document.getElementById(
            "certificateDetails"
        );


    const certificateStatus =
        String(
            certificate.certificateStatus || ""
        ).toUpperCase();


    /* =====================================================
       VALID CERTIFICATE
       ===================================================== */

    if (
        certificateStatus === "VALID"
    ) {

        icon.className =
            "verification-icon valid";


        icon.innerHTML =
            '<i class="fas fa-circle-check"></i>';


        title.textContent =
            "Certificate Verified";


        description.textContent =
            "This certificate has been successfully verified against the BaseMate Student Management DB online verification records.";

    }


    /* =====================================================
       REVOKED CERTIFICATE
       ===================================================== */

    else if (
        certificateStatus === "REVOKED"
    ) {

        icon.className =
            "verification-icon invalid";


        icon.innerHTML =
            '<i class="fas fa-circle-xmark"></i>';


        title.textContent =
            "Certificate Revoked";


        description.textContent =
            "This certificate exists in the BaseMate verification database, but its current status is REVOKED. Please contact Mishita Computers Centre for clarification.";

    }


    /* =====================================================
       OTHER / UNKNOWN STATUS
       ===================================================== */

    else {

        icon.className =
            "verification-icon checking";


        icon.innerHTML =
            '<i class="fas fa-circle-question"></i>';


        title.textContent =
            "Certificate Found";


        description.textContent =
            "The certificate record was found in the BaseMate verification database.";

    }


    /* =====================================================
       FILL CERTIFICATE INFORMATION
       ===================================================== */

    document.getElementById(
        "certificateNumber"
    ).textContent =
        certificate.certificateNumber || "—";


    document.getElementById(
        "studentName"
    ).textContent =
        certificate.studentName || "—";


    document.getElementById(
        "admissionNumber"
    ).textContent =
        certificate.admissionNumber || "—";


    document.getElementById(
        "course"
    ).textContent =
        certificate.course || "—";


    document.getElementById(
        "completionDate"
    ).textContent =
        formatDate(
            certificate.completionDate
        );


    document.getElementById(
        "issueDate"
    ).textContent =
        formatDate(
            certificate.issueDate
        );


    const statusElement =
        document.getElementById(
            "certificateStatus"
        );


    statusElement.textContent =
        certificateStatus || "—";


    /* =====================================================
       STATUS APPEARANCE
       ===================================================== */

    if (
        certificateStatus === "VALID"
    ) {

        statusElement.style.color =
            "#16803c";

        statusElement.style.fontWeight =
            "bold";

    }

    else if (
        certificateStatus === "REVOKED"
    ) {

        statusElement.style.color =
            "#c62828";

        statusElement.style.fontWeight =
            "bold";

    }

    else {

        statusElement.style.color =
            "#444";

        statusElement.style.fontWeight =
            "bold";

    }


    details.style.display =
        "block";


    document.getElementById(
        "verificationToken"
    ).textContent =
        token;


    document.getElementById(
        "verificationReference"
    ).style.display =
        "block";

}


/* =========================================================
   NOT FOUND STATE
   ========================================================= */

function showNotFound(token) {


    const icon =
        document.getElementById(
            "verificationIcon"
        );


    const title =
        document.getElementById(
            "statusTitle"
        );


    const description =
        document.getElementById(
            "statusDescription"
        );


    const details =
        document.getElementById(
            "certificateDetails"
        );


    icon.className =
        "verification-icon not-found";


    icon.innerHTML =
        '<i class="fas fa-circle-exclamation"></i>';


    title.textContent =
        "Certificate Not Found";


    description.textContent =
        "No certificate matching this verification reference could be found in the BaseMate online verification database. Please check the reference and try again.";


    details.style.display =
        "none";


    document.getElementById(
        "verificationToken"
    ).textContent =
        token;


    document.getElementById(
        "verificationReference"
    ).style.display =
        "block";

}


/* =========================================================
   SERVER / CONNECTION ERROR
   ========================================================= */

function showVerificationError() {


    const icon =
        document.getElementById(
            "verificationIcon"
        );


    const title =
        document.getElementById(
            "statusTitle"
        );


    const description =
        document.getElementById(
            "statusDescription"
        );


    icon.className =
        "verification-icon invalid";


    icon.innerHTML =
        '<i class="fas fa-triangle-exclamation"></i>';


    title.textContent =
        "Verification Service Unavailable";


    description.textContent =
        "We were unable to complete the online certificate verification at this time. Please check your internet connection and try again later.";


    document.getElementById(
        "certificateDetails"
    ).style.display =
        "none";

}


/* =========================================================
   NO TOKEN
   ========================================================= */

function showNoToken() {


    const icon =
        document.getElementById(
            "verificationIcon"
        );


    const title =
        document.getElementById(
            "statusTitle"
        );


    const description =
        document.getElementById(
            "statusDescription"
        );


    icon.className =
        "verification-icon not-found";


    icon.innerHTML =
        '<i class="fas fa-qrcode"></i>';


    title.textContent =
        "Certificate Verification";


    description.textContent =
        "Scan the QR code on a BaseMate certificate or enter the verification reference manually below.";

}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(dateValue) {


    if (!dateValue) {

        return "—";

    }


    const date =
        new Date(
            dateValue +
            "T00:00:00"
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return dateValue;

    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",

            month: "short",

            year: "numeric"
        }
    );

}


/* =========================================================
   MANUAL VERIFICATION
   ========================================================= */

function manualVerify() {


    const input =
        document.getElementById(
            "manualToken"
        );


    const token =
        input.value.trim();


    if (
        token === ""
    ) {

        input.focus();

        return;

    }


    const baseURL =
        window.location.pathname;


    const verificationURL =
        baseURL +
        "?token=" +
        encodeURIComponent(token);


    window.location.href =
        verificationURL;

}


/* =========================================================
   ENTER KEY SUPPORT
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            document.activeElement.id ===
            "manualToken"
        ) {

            manualVerify();

        }

    }
);


/* =========================================================
   LOGO FALLBACK
   =========================================================
   This preserves the logo-loading protection already
   present in the working version.
   ========================================================= */

(function () {


    const logo =
        document.getElementById(
            "mainLogo"
        );


    const logoPaths = [

        "./images/mishitacologo.PNG",

        "./images/mishitacoLogo.PNG",

        "./images/mishitacologo.png",

        "./images/mishitacoLogo.png"

    ];


    let currentPath = 0;


    if (!logo) {

        return;

    }


    logo.addEventListener(
        "error",
        function () {

            currentPath++;


            if (
                currentPath <
                logoPaths.length
            ) {

                logo.src =
                    logoPaths[currentPath];

            }

        }
    );


})();
