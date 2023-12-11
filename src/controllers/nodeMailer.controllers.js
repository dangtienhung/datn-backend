import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv';
dotenv.config()
export const sendEmail = async (data) => {
  console.log(data)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'longhdph28352@fpt.edu.vn',
      pass: 'qnwggskitxtjpaax',
    },
  })
  console.log(transporter)
  const info = await transporter.sendMail({
    from: '"Hey 🙋🏻‍♂️" <milktea@gmail.com>', 
    subject: data.subject, 
    text: data.text, 
    html: `<div class="col-md-12">   
    <div class="row">
    <div class="receipt-main col-xs-10 col-sm-10 col-md-6 col-xs-offset-1 col-sm-offset-1 col-md-offset-3">
        <div class="row">
      <div class="receipt-header">
      <div class="col-xs-6 col-sm-6 col-md-6">
        <div class="receipt-left">
          <img class="img-responsive" alt="iamgurdeeposahan" src="https://bootdey.com/img/Content/avatar/avatar6.png" style="width: 71px; border-radius: 43px;">
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-6 text-right">
        <div class="receipt-right">
          <h5>${data.name}</h5>
          <p>${data.phone} <i class="fa fa-phone"></i></p>
          <p>${data.email} <i class="fa fa-envelope-o"></i></p>
          <p>Việt Nam <i class="fa fa-location-arrow"></i></p>
        </div>
      </div>
    </div>
        </div>
  <div class="row">
    <div class="receipt-header receipt-header-mid">
      <div class="col-xs-8 col-sm-8 col-md-8 text-left">
        <div class="receipt-right">
          <h5>${data.name ? data.name : "xin chao"} </h5>
          <p><b>Mobile :</b> ${data.phone ? data.phone  : "05634"}</p>
          <p><b>Email :</b> ${data.email}</p>
          <p><b>Address :</b> Việt Nam</p>
        </div>
      </div>
      <div class="col-xs-4 col-sm-4 col-md-4">
        <div class="receipt-left">
          <h3>HÓA ĐƠN ĐẶT HÀNG TRÀ SỮA CONNECT</h3>
        </div>
      </div>
    </div>
        </div>
  
        <div>
            <table class="table table-bordered">
                <thead style="background: #414143 none repeat scroll 0 0">
                    <tr>
                        <th style="padding :13px 20px !important ">Description</th>
                        <th style="padding :13px 20px !important" >Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="col-md-9">Tên SẢN PHẨM</td>
                        <td class="col-md-3"><i class="fa fa-inr"></i> ${data.trasua ? data.trasua : ""}</td>
                    </tr>
                </tbody>
            </table>
        </div>
  <div class="row">
    <div class="receipt-header receipt-header-mid receipt-footer">
      <div class="col-xs-8 col-sm-8 col-md-8 text-left">
        <div class="receipt-right">
          
          <h5 style="color: rgb(140, 140, 140);">Thanks for shopping.!</h5>
        </div>
      </div>
      <div class="col-xs-4 col-sm-4 col-md-4">
        <div class="receipt-left">
          <h1>TRÀ SỮA CONNECT</h1>
        </div>
      </div>
    </div>
        </div>
  
    </div>    
</div>
</div>`, 
    to: data.to,
  })
  console.log(info)
}