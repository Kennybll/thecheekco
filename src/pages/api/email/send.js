import { SMTPClient } from "emailjs";

export default function handler(req, res) {
  console.log(req.body);
  const {
    firstName,
    lastName,
    company,
    email,
    phoneNumber,
    message,
    type,
    dateRequired,
  } = req.body;

  const client = new SMTPClient({
    user: process.env.EMAILACCOUNT,
    password: process.env.EMAIL_PASS,
    host: "smtp.mail.us-east-1.awsapps.com",
    ssl: true,
    port: 465,
  });

  const emailBody = `
    <h1>The Cheek Co</h1>
    <p>
        ${firstName} ${lastName} has sent you a message:
    </p>
    <p>
        ${message}
    </p>
    <p>
        Company: ${company}
    </p>
    <p>
        Email Address: ${email}
    </p>
    <p>
        Phone Number: ${phoneNumber}
    </p>
    `;
  const requestBody = `
    <h1>The Cheek Co</h1>
    <p>
        ${firstName} ${lastName} has sent you a special request!
    </p>
    <p>
        ${type}
    </p>
    <p>
        ${dateRequired}
    </p>
    <p>
        ${message}
    </p>
    <p>
        Company: ${company}
    </p>
    <p>
        Email Address: ${email}
    </p>
    <p>
        Phone Number: ${phoneNumber}
    </p>
    `;

  try {
    client.send(
      {
        text: type != null ? emailBody : requestBody,
        from: process.env.EMAILACCOUNT,
        to: "danieldeveney@hotmail.com",
        subject: "testing emailjs",
        attachment: [
          {
            data: type != null ? emailBody : requestBody,
            alternative: true,
          },
        ],
      },
      (err, message) => {
        console.log(err || message);
      }
    );
  } catch (e) {
    console.log(e);
    res.status(400).end(JSON.stringify({ e }));
    return;
  }

  res.status(200).end(JSON.stringify({ message: "Send Mail" }));
}
