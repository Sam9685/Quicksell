import React, { useState, useEffect } from 'react';
import { fetchTickets } from '../utils/api';
import TicketCard from './Cards';
import DisplayOptions from './Navbar';
import Todo from "../assets/To-do.svg";
import Inprogress from "../assets/in-progress.svg";
import Done from "../assets/Done.svg";
import Cancel from "../assets/Cancelled.svg";
import Backlog from "../assets/Backlog.svg";
import Add from "../assets/add.svg";
import Menu from "../assets/3 dot menu.svg";
import UrgentPrioritycolor from "../assets/SVG - Urgent Priority colour.svg";
import UrgentPrioritygrey from "../assets/SVG - Urgent Priority grey.svg";
import NoPriority from "../assets/No-priority.svg";
import MediumPriority from "../assets/Img - Medium Priority.svg";
import LowPriority from "../assets/Img - Low Priority.svg";
import HighPriority from "../assets/Img - High Priority.svg";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [display, setDisplay] = useState('Grouping');
  const [groupBy, setGroupBy] = useState(localStorage.getItem('groupBy') || 'status');
  const [orderBy, setOrderBy] = useState(localStorage.getItem('orderBy') || 'Priority');
  const [users, setUsers] = useState([]);

  const StatusIcons = {
    Todo,
    'In progress': Inprogress,
    Backlog,
    Done,
    Canceled: Cancel,
  };

  const PriorityIcons = {
    1: UrgentPrioritycolor,
    2: HighPriority,
    3: MediumPriority,
    4: LowPriority,
    0: NoPriority,
  };

  useEffect(() => {
    const fetchData = async () => {
      const { tickets, users } = await fetchTickets();
      setTickets(tickets);
      setUsers(users);
    };
    fetchData();
  }, []);

  const groupedTickets = groupTickets(tickets, users, groupBy);
  const orderedTickets = orderTickets(tickets, orderBy);

  const getPriorityLabel = (priority) => {
    const labels = {
      1: 'Urgent',
      2: 'High',
      3: 'Medium',
      4: 'Low',
      0: 'No priority',
    };
    return labels[priority] || 'No priority';
  };

  return (
    <div>
      <DisplayOptions
        display={display}
        setDisplay={setDisplay}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
      />
      <div className="kanban-board">
        {display === 'Grouping' ? (
          Object.entries(groupedTickets).map(([key, group]) => (
            <div key={key} className="kanban-column">
              <div className='Header'>
                <div className='HeaderStatus'>
                  {groupBy === 'priority' ? (
                    <>
                      <img src={PriorityIcons[Number(key)]} alt={getPriorityLabel(Number(key))} />
                      <h5>{getPriorityLabel(Number(key))}</h5>
                      <p className='card-count'>{group.length}</p>
                    </>
                  ) : groupBy === 'user' ? (
                    <>
                      <div className="default-icon"></div>
                      <h5>{key}</h5>
                    </>
                  ) : (
                    <>
                      <img src={StatusIcons[key]} alt={key} />
                      <h5>{key}</h5>
                    </>
                  )}
                </div>
                <div className='HeaderButton'>
                  <img src={Add} alt="Add" />
                  <img src={Menu} alt="Menu" />
                </div>
              </div>
              {group.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} users={users} groupBy={groupBy} />
              ))}
            </div>
          ))
        ) : (
          <div className="ordered-tickets">
            {orderedTickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} users={users} groupBy={groupBy} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const groupTickets = (tickets, users, groupBy) => {
  const grouped = {};
  const userMap = Object.fromEntries(users.map(user => [user.id, user.name]));

  if (groupBy === 'status') {
    ['Backlog', 'In progress', 'Todo', 'Done', 'Canceled'].forEach(status => {
      grouped[status] = tickets.filter(ticket => ticket.status === status);
    });
    return grouped;
  }

  if (groupBy === 'user') {
    return tickets.reduce((groups, ticket) => {
      const username = userMap[ticket.userId] || ticket.userId;
      if (!groups[username]) {
        groups[username] = [];
      }
      groups[username].push(ticket);
      return groups;
    }, {});
  }

  if (groupBy === 'priority') {
    return tickets.reduce((groups, ticket) => {
      const key = ticket.priority;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(ticket);
      return groups;
    }, {});
  }

  return grouped;
};

const orderTickets = (tickets, orderBy) => {
  return [...tickets].sort((a, b) => {
    if (orderBy === 'Priority') {
      return b.priority - a.priority;
    } else if (orderBy === 'Title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
};

export default KanbanBoard;
