import React from 'react';
import Dot from '../assets/3 dot menu.svg';
import '../styles/card.css';
import Todo from "../assets/To-do.svg";
import Inprogress from "../assets/in-progress.svg";
import Done from "../assets/Done.svg";
import Cancel from "../assets/Cancelled.svg";
import Backlog from "../assets/Backlog.svg";

const TicketCard = ({ ticket, users, groupBy }) => {
  const user = users.find(user => user.id === ticket.userId) || {};
  
  const priorityLabels = {
    4: 'Urgent',
    3: 'High',
    2: 'Medium',
    1: 'Low',
    0: 'No priority',
  };

  const StatusSvgs = {
    "Todo": Todo,
    "In progress": Inprogress,
    "Backlog": Backlog,
    "Done": Done,
    "Canceled": Cancel,
  };

  const getStatusIcon = (status) => {
    return StatusSvgs[status] ? (
      <img src={StatusSvgs[status]} alt={status} />
    ) : (
      <div className='Dummy'>@</div>
    );
  };

  return (
    <div className='ticket-card'>
      <div className='ticket-header'>
        <div className='ticket-id'>{ticket.id}</div>
        <div className='user-profile'>
          {user.profileImage ? (
            <img src={user.profileImage} alt={`${user.name}'s profile`} />
          ) : (
            <div className="default-user-icon"></div>
          )}
        </div>
      </div>
      <div className='title'>
        {getStatusIcon(ticket.status)}
        <div className='ticket-title'>{ticket.title}</div>
      </div>
      <div className='ticket-tag'>
        {groupBy === 'priority' ? null : (
          <>
            <img className='tag-icon' src={Dot} alt="Tag icon" />
            <div className='tag-label'>
              <div className='bullet'></div>
              {ticket.tag[0]}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
