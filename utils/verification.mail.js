import nodemailer from 'nodemailer'

// to create token and object for hr verification model

const mail = (emailAddress, content) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'lol735776@gmail.com',
            pass: 'AppyCodes'
        }
    });
    let subject = content.subject
    let message = content.message
    let mailoptions = {
        from: 'lol735776@gmail.com',
        to: `${emailAddress}`,
        subject,
        text:message
    };

    transporter.sendMail(mailoptions, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            res.json({
                message: "mailsent"
            });
            console.log("registration mail sent")
        }
    });

}

export default mail