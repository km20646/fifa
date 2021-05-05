var startModal;
var accessId;
startModal = new bootstrap.Modal(document.getElementById("startModal"), {
    backdrop: false,
    keyboard: false,
});

$("#toggler").click(function () {
    $("#intro").toggleClass("navzero");
});
function getFormatDate(date) {
    var year = date.getFullYear(); //yyyy
    var month = 1 + date.getMonth(); //M
    month = month >= 10 ? month : "0" + month; //month 두자리로 저장
    var day = date.getDate(); //d
    day = day >= 10 ? day : "0" + day; //day 두자리로 저장
    return year + "" + month + "" + day; //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
}
function getDataAjax(url, nickname, id) {
    return $.ajax({
        type: "GET",
        url: `${url}${nickname}`,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "String");
            xhr.setRequestHeader(
                "Authorization",
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiMTkxMzA4NTA3NyIsImF1dGhfaWQiOiIyIiwidG9rZW5fdHlwZSI6IkFjY2Vzc1Rva2VuIiwic2VydmljZV9pZCI6IjQzMDAxMTQ4MSIsIlgtQXBwLVJhdGUtTGltaXQiOiIyMDAwMDoxMCIsIm5iZiI6MTU4MTY2MDc2MiwiZXhwIjoxNjQ0NzMyNzYyLCJpYXQiOjE1ODE2NjA3NjJ9.IxFpLK1aw0axXRvAgzEPv8AbhGFdMtXzfGp9IqMkATs"
            );
        },
        // dataType: "json",
    });
}
function findId(el, spid) {
    if (el.id === spid) {
        return true;
    }
}
function getDataAjax2() {
    return;
}
function playerInfo(spid) {
    var player;
    $.ajax({
        type: "GET",
        async: false,
        url: `./player.json`,

        success: function (res) {
            player = res.find((element, index, arr) => element.id === spid);
            player = player.name;
        },
    });
    return player;
}

function renderTable(res) {
    return new Promise(function (resolve, reject) {
        $("#transferTable").DataTable({
            responsive: true,
            select: true, ///항목 선택기능 추가
            scrollCollapse: true,
            processing: true,
            autoWidth: true,
            // scrollX: true,
            scrollY: "450px",
            destroy: true,
            order: [[0, "asc"]],
            pagingType: "simple",
            dom: 'rt<"float-left"p>',
            data: res,

            columns: [
                {
                    data: "tradeDate",
                    render: function (data) {
                        return data.substr(0, 10);
                    },
                },
                {
                    data: "spid",
                    render: function (data, type, row, meta) {
                        var names = playerInfo(data);
                        return names;
                    },
                },
                {
                    data: "grade",
                    render: function (data) {
                        return data + "카";
                    },
                },
                {
                    data: "value",
                    render: function (data) {
                        return data.toLocaleString("ko-KR");
                    },
                },
            ],
        });
        resolve("Finish");
    });
}
$("#testBtn").on("click", function () {
    startModal.hide();
    let nick = $("#testInput").val();
    console.log(nick);
    getDataAjax("https://api.nexon.co.kr/fifaonline4/v1.0/users?nickname=", nick, "123")
        .done((res) => {
            $("#myLevel").text(res.nickname);
            $("#getMyInfo").text(`LV : ${res.level}`);
            accessId = res.accessId;
            $("#transferTable > tbody").append(
                "<tr><td></td><td colspan='2'><i class='fa fa-spinner fa-spin fa-3x fa-fw'></i><span class='sr-only'>Loading...</span><td></tr>"
            );
        })
        .done(() => {
            getDataAjax("https://api.nexon.co.kr/fifaonline4/v1.0/users/", `${accessId}/maxdivision`, "123").done((res) => {
                let normalMatch = res[0];
                $("#getMyteer").text(`${normalMatch.division} /${normalMatch.achievementDate.substr(0, 10)}`);
                console.log(typeof normalMatch.achievementDate);
                $("#getMyteerDate").text();
            });
        })
        .done(() => {
            getDataAjax(`https://api.nexon.co.kr/fifaonline4/v1.0/users/${accessId}/markets?tradetype=sell`, `&limit=50`, "123").done((res) => {
                renderTable(res).then((res) => {
                    $("table>thead").addClass("bg-dark text-white");
                    $("#transferTable_paginate").addClass("mt-3");
                });
            });
        });
});
$(document).ready(function () {
    startModal.show();
});
