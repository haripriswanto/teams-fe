// Function Data Tim Pegawai
function getData() {
  $("#data-table").html("");
  $.ajax({
    url: "http://localhost:8000/api/tim-pegawai",
    type: "get",
    dataType: "json",
    data: {},
    success: function (result) {
      // console.log(result.data.total);
      
      if (result.success == true) {
        let data = result.data.data;
        $.each(data, function (i, data) {
          $("#data-table").append(
            `<tr>
                <td>` +data.tim_peg_id +`</td>
                <td>` +data.tim_nama +`</td>
                <td>` +data.peg_nama +`</td>
                <td><button type="button" class="btn btn-link deleted" data-id="`+data.tim_peg_id+`"><i class="bi bi-trash"></i></button></td>
            </tr>`
          );
        });
      } else if (result.success == true && result.data.total == 0) {
        $("#data-table").append(
          `<tr colspan="4">
              <td>Data Not Found</td>
            </tr>
          `);
      }
    },
  });
}

// function for getDataPegawai
function getDataPegawai() {
  $("#selectPegawai").html("");
  $.ajax({
    url: "http://localhost:8000/api/pegawai",
    type: "get",
    dataType: "json",
    data: {},
    success: function (result) {
      if (result.success == true) {
        let data = result.data.data;
        // console.log(data);
        $("#selectPegawai").append(`<option value="">Pilih Pegawai</option>`);
        $.each(data, function (i, data) {
          $("#selectPegawai").append(
            `<option value="` + data.peg_id + `">` + data.peg_nama + `</option>`
          );
        });
      } else {
        $("#selectPegawai").html(`
                <option value="">Data Not Found</option>
            `);
      }
    },
  });
}

// function for getDataTim
function getDataTim() {
  $("#selectTim").html("");
  $.ajax({
    url: "http://localhost:8000/api/tim",
    type: "get",
    dataType: "json",
    data: {},
    success: function (result) {
      if (result.success == true) {
        let data = result.data.data;
        // console.log(data);
        $("#selectTim").append(`<option value="">Pilih Tim</option>`);
        $.each(data, function (i, data) {
          $("#selectTim").append(
            `<option value="` + data.tim_id + `">` + data.tim_nama + `</option>`
          );
        });
      } else {
        $("#selectTim").html(`
                  <option value="">Data Not Found</option>
              `);
      }
    },
  });
}

// function for Insert Pegawai
function insertDataPegawai() {
    $.ajax({
      url: "http://localhost:8000/api/pegawai",
      type: "post",
      dataType: "json",
      data: {
        'peg_nama' : $('#namaPegawai').val()
      },
      success: function (result) {
        // console.log(result);
        if (result.success == true) {
            toastr.success(result.message, "Success");
            getDataPegawai();
            $('#namaPegawai').val('');
            $('#namaPegawai').focus();
            hideModal('AddPegawai')
        } else {
            toastr.error(result.error, "Failed")
            $('#namaPegawai').focus();
        }
      },
    });
}

// function for Insert Tim
function insertDataTim() {
    $.ajax({
      url: "http://localhost:8000/api/tim",
      type: "post",
      dataType: "json",
      data: {
        'tim_nama' : $('#namaTim').val()
      },
      success: function (result) {
        // console.log(result);
        if (result.success == true) {
            toastr.success(result.message, "Success");
            getDataTim();
            $('#namaTim').val('');
            $('#namaTim').focus();
            hideModal('AddTim')
        } else {
            toastr.error(result.error, "Failed")
            $('#namaTim').focus();
        }
      },
    });
}

// function for Insert Tim Pegawai
function insertDataTimPegawai() {
    let peg_id = $('#selectPegawai').val();
    let tim_id = $('#selectTim').val();

    if (peg_id == '') {
        toastr.error("Pegawai wajib dipilih", "Failed")
        $('#selectPegawai').focus();
    }
    else if (tim_id == '') {
        toastr.error("Tim wajib dipilih", "Failed")
        $('#selectTim').focus();
    }
    else {
        $.ajax({
            url: "http://localhost:8000/api/tim-pegawai",
            type: "post",
            dataType: "json",
            data: {
                'peg_id' : peg_id,
                'tim_id' : tim_id
            },
            success: function (result) {
                // console.log(result);
                if (result.success == true) {
                    toastr.success(result.message, "Success");
                    getData();
                    getDataPegawai();
                    getDataTim();
                } else {
                    toastr.error(result.error, "Failed")
                    $('#selectPegawai').focus();
                }
            },
        });
    }
}
// function for Delete Tim
function deleteDataTim(id) {
    // console.log(id);
    var confirmation = confirm("Anda yakin ingin menghapus data ini ?");

    if (confirmation) {     
        $.ajax({
            url: "http://localhost:8000/api/tim-pegawai/"+id,
            type: "delete",
            dataType: "json",
            data: {},
            success: function (result) {
            if (result.success == true) {
                toastr.success(result.message, "Success");
                getData();
            } else {
                toastr.error(result.error, "Failed")
            }
            },
        });   
    }
}

// show data Tim Pegawai on reload Page
$(document).ready(function () {
  getData();
  getDataPegawai();
  getDataTim();
  //   getFormtim();
});

// Click refresh Button for Update data Tim Pegawai
$("#refresh-button").on("click", function () {
  getData();
  getDataPegawai();
  getDataTim();
});

// Insert Data Pegawai Button 
$("#button-add-pegawai").on('click', function() {
    insertDataPegawai();
})
// Insert Data Pegawai Enter 
$("#namaPegawai").on('keyup', function(e) {
    if(e.keyCode === 13){
        insertDataPegawai();
    }
})

// Insert Data Tim Button 
$("#button-add-tim").on('click', function() {
    insertDataTim();
})
// Insert Data Tim Enter 
$("#namaTim").on('keyup', function(e) {
    if(e.keyCode === 13){
        insertDataTim();
    }
})

// Insert Data Mapping Tim Pegawai Button 
$("#button-tim-pegawai").on('click', function() {
    insertDataTimPegawai();
})

$("#data-table").on('click', '.deleted', function() {
    let id = $(this).data('id');
    deleteDataTim(id);
})

function hideModal(modalID){
    $('#'+modalID+'').modal('hide');	
}