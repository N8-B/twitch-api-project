import React, { Component } from 'react';
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list';
import style from './style';

const UserList = (props) => (
  <List selectable ripple>
    <ListSubHeader caption='Explore characters' />
    <ListItem
      avatar='https://dl.dropboxusercontent.com/u/2247264/assets/m.jpg'
      caption='Dr. Manhattan'
      legend="Jonathan 'Jon' Osterman"
      rightIcon='star'
    />
    <ListItem
      avatar='https://dl.dropboxusercontent.com/u/2247264/assets/o.jpg'
      caption='Ozymandias'
      legend='Adrian Veidt'
      rightIcon='star'
    />
    <ListItem
      avatar='https://dl.dropboxusercontent.com/u/2247264/assets/r.jpg'
      caption='Rorschach'
      legend='Walter Joseph Kovacs'
      rightIcon='star'
    />
  </List>
);

export default UserList;
