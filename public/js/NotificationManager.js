import { SFXSound } from './SFXEngine.js';

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function createNotification(title, content) {
    // <li id='notification-1' class='notification'>
    //     <div class='notification-header'>
    //         <span class='material-symbols-rounded'>notifications</span>
    //         <p class='notification-title'>Notification Title</p>
    //     </div>
    //     <p class='notification-body'>Notification Body</p>
    // </li>;
    SFXSound('notification');

    const notification = document.createElement('li');
    notification.classList.add('notification');
    notification.id = `notification-${Date.now()}`;

    const notificationHeader = document.createElement('div');
    notificationHeader.classList.add('notification-header');

    const notificationIcon = document.createElement('span');
    notificationIcon.classList.add('material-symbols-rounded');
    notificationIcon.innerText = 'notifications';
    notificationHeader.appendChild(notificationIcon);

    const notificationTitle = document.createElement('p');
    notificationTitle.classList.add('notification-title');
    notificationTitle.innerText = title;
    notificationHeader.appendChild(notificationTitle);

    notification.appendChild(notificationHeader);

    const notificationBody = document.createElement('p');
    notificationBody.classList.add('notification-body');
    notificationBody.innerText = content;
    notification.appendChild(notificationBody);

    const notificationList = document.getElementById('notification-stack');
    notificationList.appendChild(notification);
    // add class .notification-slide-in
    // wait 5 seconds
    // remove class .notification-slide-in
    notification.classList.add('notification-slide-in');
    await sleep(5000);

    notification.classList.remove('notification-slide-in');
    notification.classList.add('notification-slide-out');
    await sleep(300);
    notificationList.removeChild(notification);
}
