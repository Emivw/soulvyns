export const users = [
  {
    id: 'USR001',
    name: 'Sarah Lee',
    email: 'sarah.lee@example.com',
    avatar: 'https://i.pravatar.cc/150?u=sarahlee',
    role: 'Admin',
  },
  {
    id: 'USR002',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?u=johndoe',
    role: 'Member',
  },
  {
    id: 'USR003',
    name: 'Emily Chen',
    email: 'emily.chen@example.com',
    avatar: 'https://i.pravatar.cc/150?u=emilychen',
    role: 'Member',
  },
  {
    id: 'USR004',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    avatar: 'https://i.pravatar.cc/150?u=michaelbrown',
    role: 'Member',
  },
];

export const resources = [
  {
    id: 'RES001',
    name: 'Conference Room A',
    type: 'Meeting Room',
    capacity: 10,
    isPaid: false,
  },
  {
    id: 'RES002',
    name: 'Projector 1',
    type: 'Equipment',
    capacity: 1,
    isPaid: false,
  },
  {
    id: 'RES003',
    name: 'Focus Booth 1',
    type: 'Private Office',
    capacity: 1,
    isPaid: true,
  },
  {
    id: 'RES004',
    name: 'Conference Room B',
    type: 'Meeting Room',
    capacity: 8,
    isPaid: true,
  },
];

export const bookings = [
  {
    id: 'BK001',
    title: 'Project Kickoff',
    user: 'Sarah Lee',
    resource: 'Conference Room A',
    start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    end: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(new Date().getHours() + 1)).toISOString(),
    status: 'Confirmed',
  },
  {
    id: 'BK002',
    title: 'Design Review',
    user: 'John Doe',
    resource: 'Conference Room B',
    start: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    end: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(new Date().getHours() + 2)).toISOString(),
    status: 'Pending',
  },
  {
    id: 'BK003',
    title: 'Client Presentation',
    user: 'Emily Chen',
    resource: 'Projector 1',
    start: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    end: new Date(new Date(new Date().setDate(new Date().getDate() + 3)).setHours(new Date().getHours() + 1)).toISOString(),
    status: 'Confirmed',
  },
];

export const notifications = [
    {
        title: "New Booking Confirmed",
        description: "Project Kickoff in Conference Room A is confirmed."
    },
    {
        title: "Booking Canceled",
        description: "Your booking for Focus Booth 1 has been canceled."
    },
    {
        title: "Upcoming Meeting",
        description: "Design Review starts in 1 hour."
    }
]
