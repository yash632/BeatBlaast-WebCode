console.log(`"Hey there, coding maestro! Please refrain from 'borrowing' the code."`);

//………………Customised Refresh………………
window.addEventListener('beforeunload', function(event) {
  const confirmationMessage = 'Do you want to leave this page?';
  event.returnValue = confirmationMessage;
  return confirmationMessage;
});
//……………Customised Refresh END…………

//……………………Logo Rotation………………………
const image = document.getElementById('flogo');
let timeout;
function tiltImage() {
  image.classList.add('tilted');
  timeout = setTimeout(() => {
    image.classList.remove('tilted');
  }, 1000);
}
setInterval(tiltImage, 2000);
//………………Logo Rotation END…………………

//………………………variables……………………………
let details;
let idFlag;
let logPassword;
let logEmail;
//……………………variables END…………………………

//………………………local storage………………………
let localName = localStorage.getItem("fullName");

let localEmail = localStorage.getItem("email");

let localPassword = localStorage.getItem("password");

let localPhone = localStorage.getItem("mobileNo");

let localIdFlag = localStorage.getItem("idFlag");

if (localIdFlag == 1) {
  console.log(`inside flag`);
  if (localName && localEmail && localPassword && localPhone) {
    details = `<br>Name: ${localName}<br>Mobile No: ${localPhone}<br>Email: ${localEmail}`;

    document.querySelector('.container').classList.add('none');
    document.querySelector('form').classList.add('none');
    document.querySelector('.scontainer').classList.remove('snone');
  }
}
//…………………local storage END…………………

//…………………………Submit signup………………………
let signupForm = document.querySelector('#formSign');
signupForm.addEventListener('submit', async function(event) {
  event.preventDefault();

  let fullName = document.getElementById('fullName').value.trim().toUpperCase();
  let mobileNo = document.getElementById('mobileNo').value.trim();
  let email = document.getElementById('email').value.trim();
  let password = document.getElementById('newPassword').value.trim();

  try {
    const response = await fetch('https://beatblaast.freewebhostmost.com/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName, email, password, mobileNo }),
    });

    if (response.ok) {
    details =`<br>Name : ${fullName}<br>Mobile No : ${mobileNo}<br>Email : ${email}`;
      localStorage.setItem('fullName', fullName);
      localStorage.setItem('email', email);
      localStorage.setItem('mobileNo', mobileNo);
      localStorage.setItem('password', password);

      idFlag = 1;
      localStorage.setItem('idFlag', idFlag);
      signupForm.classList.add('none');
      document.querySelector('.scontainer').classList.remove('snone');
    } 
    else {
document.querySelector('.signFail').classList.remove('snone');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
//…………………Submit signup END…………………


async function retrieveReview() {
   try {
    const response = await fetch('https://beatblaast.freewebhostmost.com/all_reviews'); 
    if (response.ok) {
      const reviews = await response.json();

    let htmlReviewData = document.querySelector('.reviewData');
htmlReviewData.innerHTML = '';
      
for (let reviewData of reviews) {
  
    const reviewElement = document.createElement('li');
    reviewElement.classList.add('reviewData_li');
    reviewElement.innerHTML = `<span>${reviewData.nameForReview}: </span><span>${reviewData.reviewInput}</span>`;
    // Append the new list item to the container
    htmlReviewData.prepend(reviewElement);
}
    } else {
      console.error('Failed to fetch reviews');
    }
  }
  catch (error) {
    console.error('Error fetching reviews:', error);
  } 
 }
 

let reviewTab = document.querySelector('.review');
reviewTab.addEventListener('click', async function() {
  document.querySelector('.reviewCont').classList.remove('searchNone')
  document.querySelector('.right_head').classList.add('none');
  document.querySelector('.control_details').classList.add('none');
  document.querySelector('.right_cont').classList.add('none');

  if (left.classList.contains('leftactive')) {
    left.classList.remove('leftactive');
  }
    left.classList.add('left');


if(!(reviewTab.classList.contains('reviewAdded'))){
  
 retrieveReview();
  reviewTab.classList.add('reviewAdded');
  
}  
});

//……………………………Review……………………………………
let reviewForm = document.querySelector('#reviewForm');
reviewForm.addEventListener('submit', async function(event){
  event.preventDefault();
  let nameForReview = localStorage.getItem("fullName");

  let reviewInput = document.getElementById('reviewInput').value.trim();

  try {
    const response = await fetch('https://beatblaast.freewebhostmost.com/submit_review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nameForReview,reviewInput }),
    });

    if (response.ok) {
    document.getElementById('reviewInput').value = "";
document.querySelector('.reviewSuccess').classList.remove('snone');
      setTimeout(() => {
document.querySelector('.reviewSuccess').classList.add('snone');
        }, 3000);
        retrieveReview();
    } 
    else {
alert(`fail to send review`);
    }
  } catch (error) {
    console.error('Error:', error);
  }


});
//…………………………Review END……………………………

//…………………………Submit login………………………
let loginForm = document.querySelector('#formLog');
loginForm.addEventListener("submit", async function(event) {
  event.preventDefault();
  logEmail = document.querySelector('#logEmail').value.trim();
  logPassword = document.querySelector('#logPassword').value.trim();

  try {
    const response = await fetch('https://beatblaast.freewebhostmost.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: logEmail, password: logPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      idFlag = 1;
      localStorage.setItem('idFlag', idFlag);
      localStorage.setItem('fullName', data.user.Name);
      localStorage.setItem('email', data.user.Email);
      localStorage.setItem('mobileNo', data.user.MobileNo);
      localStorage.setItem('password', data.user.Password);
      loginForm.classList.add('none');

      details = `<br>Name: ${data.user.Name}<br>Mobile No: ${data.user.MobileNo}<br>Email: ${data.user.Email}`;
      //details = JSON.parse(localStorage.getItem('userDetails'));
      document.querySelector('.scontainer').classList.remove('snone');
    } 
    else {
document.querySelector('.logFail').classList.remove('snone');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
//……………………Submit login END……………………

//………………………Sign up button………………………
let btn = document.querySelector('.btn');
btn.addEventListener("click", function() {
  document.querySelector('.container').classList.add('none');
  document.querySelector('form').classList.remove('none');
});
//…………………Sign up button END…………………

//………………………Log In Button………………………
let logBtn = document.querySelector('.log_btn');
logBtn.addEventListener("click", function() {
 document.querySelector('.container').classList.add('none');
  document.querySelector('#formLog').classList.remove('none');
});
//…………………Log In Button END………………

//…………………Some eventListeners………………
let left = document.querySelector('.left');

document.querySelector('.hamburger').addEventListener('click', function() {
  left.classList.remove('left');
  left.classList.add('leftactive');
});

document.querySelector('.cut').addEventListener('click', function() {
  left.classList.remove('leftactive');
  left.classList.add('left');
});
document.querySelector('.about').addEventListener('click', function() {
  document.querySelector('.ababout').classList.remove('abnone');
  document.querySelector('.scontainer').classList.add('abnone');
});
document.querySelector('.back').addEventListener('click', function() {
  document.querySelector('.scontainer').classList.remove('abnone');
  document.querySelector('.ababout').classList.add('abnone');
});

document.querySelector('.infotab').addEventListener('click', function() {
  document.querySelectorAll('.home_list').forEach(item => {
    item.classList.add('none');
  });
  document.querySelector('.info_data').classList.remove('none');
  document.querySelector('.info_data').innerHTML = `<img src="back.svg" class="info_back invert">${details}`;

  console.log(details);
  document.querySelector('.info_back').addEventListener('click', function() {
    document.querySelector('.info_data').classList.add('none');

    document.querySelectorAll('.home_list').forEach(item => {
      item.classList.remove('none');
    });
  });
});

document.querySelector('.home_tab').addEventListener('click', function() {
  document.querySelector('.scontainer').classList.add('none');
  document.querySelector('.container').classList.remove('none');
  btn.classList.add('none');
  logBtn.classList.add('none');
  document.querySelector('.back_btn').classList.remove('none');
});
document.querySelector('.back_btn').addEventListener('click', function() {
  document.querySelector('.scontainer').classList.remove('none');
  document.querySelector('.container').classList.add('none');
});
document.querySelector('.search_tab').addEventListener('click', function() {
  document.querySelector('.searchListCont').classList.remove('searchNone')
  document.querySelector('.right_head').classList.add('none');
  document.querySelector('.right_cont').classList.add('none');

  if (left.classList.contains('leftactive')) {
    left.classList.remove('leftactive');
    left.classList.add('left');
  }
});

document.querySelector('.review').addEventListener('click', function() {
  document.querySelector('.reviewCont').classList.remove('searchNone')
  document.querySelector('.right_head').classList.add('none');
  document.querySelector('.control_details').classList.add('none');
  document.querySelector('.right_cont').classList.add('none');

  if (left.classList.contains('leftactive')) {
    left.classList.remove('leftactive');
    left.classList.add('left');
  }
});

document.querySelector('.searchBack').addEventListener('click', function() {
  document.querySelector('.searchListCont').classList.add('searchNone')
  document.querySelector('.right_head').classList.remove('none');
  document.querySelector('.right_cont').classList.remove('none');
})

document.querySelector('.logOut').addEventListener('click', function() {
  location.reload();
  idFlag=0;
  localStorage.setItem("idFlag", idFlag);
  
});

document.querySelector('.reviewBack').addEventListener('click', function() {

  document.querySelector('.reviewCont').classList.add('searchNone')
  document.querySelector('.right_head').classList.remove('none');
  document.querySelector('.control_details').classList.remove('none');
  document.querySelector('.right_cont').classList.remove('none');

})
//…………………EventListeners END………………