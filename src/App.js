import React, { useState } from 'react';

import './App.css';

let my_notes = [
  {
    value: 'do some stuff',
    children: [
      {value: 'other stuff'},
      {value: 'other stuff'},
      {value: 'other stuff'},
      {value: 'other stuffasdfsad', children: [{value: 'thingsasdf'}, {value: 'wow'}]},
      {value: 'other stuff'}
    ]
  }
];

function parseNotes(notes, index) {
  notes.forEach((note, i) => {
    if (Array.isArray(note.index) && index !== undefined) {
      note.index = [].concat(index);
      note.index.push(i);
      if (note.children) {
        note.children.forEach(child => child.index = [i])
      }
    } else {
      note.index = [i];
      if (note.children) {
        note.children.forEach(child => child.index = [i])
      }
    }
    if (note.children) {
      parseNotes(note.children, note.index);
    }
  });
}

parseNotes(my_notes);

function App() {
  let [selected, setSelected] = useState([0])
  let [notes, setNotes] = useState(my_notes)
  let selectedNote;

  function toggleSelected(index, newNotes) {
    newNotes.forEach(note => {
      if (note.index.join('') === index.join('')) {
        note.selected = true;
        selectedNote = note;
      } else {
        note.selected = false;
      }

      if (note.children) {
        toggleSelected(index, note.children);
      }
    });
  }

  function handleSelect(note) {
    let newNotes = [...notes];
    toggleSelected(note.index, newNotes);
    setNotes(newNotes);
  }

  function globalKeyPress(e) {
    e.preventDefault();

    console.log(e.key)
  }

  return (
    <div>
      <div>
        <p>Notes</p>
        {notes.map((note, i) => {
          return <Note 
            key={i}
            note={note}
            value={note.value}
            handleSelect={(note) => {handleSelect(note)}}
            children={note.children} />;
        })}
      </div>
    </div>
  );
}

function Note(props) {
  let [value, setValue] = useState(props.value);

  function toggleEdit(e) {
    e.preventDefault();
    e.stopPropagation();
    props.handleSelect(props.note);
  }

  function handleEdit(e) {
    e.preventDefault();
    setValue(e.target.value);
  }

  function handleKeyPress(e) {
    e.preventDefault();
    if (e.keyCode === 13) {
    }
  }

  function handleLinkKey(e) {
    e.preventDefault();
    // if (e.keyCode === 13) {
    //   setSelected(!selected)
    // }
  }

  function renderIndex(index) {
    return (
      <span className="render-index">{index.map((thing, i) => <span key={i}>{thing}.</span>)} - </span>
    );
  }

  let selectedStyle = {
    border: props.note.selected ? '1px solid #fff' : ''
  };

  return (
    <ul>
      <li className="note-li" onClick={(e) => toggleEdit(e)}>
          {renderIndex(props.note.index)} 
          {props.note.selected ? 
            <input className="note-input" type="text" autoFocus value={value} onKeyUp={(e) => handleKeyPress(e)} onClick={toggleEdit} onChange={(e) => handleEdit(e)} />
            :
            <span className="note-value">{value}</span>
          }
      </li>
      {!props.note.children ? '' : props.note.children.map((c, i) => {
        return <Note note={c} value={c.value} handleSelect={props.handleSelect} key={i} />;
      })}
    </ul>
  );
}

export default App;
