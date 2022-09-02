import React, {useEffect, useState} from "react";
import axios from "axios";
import dateFormat from 'dateformat';

const ListForm = () => {
    const [list,setList] = useState('');
    const [title,setTitle] = useState('');
    const [datee,setDatee] = useState('');
    const [listId,setListId] = useState('');
    const [listId2,setListId2] = useState('');
    const [count,setCount] = useState(0);
    const [getList,setGetList] = useState([]);
    const [getTodoList,setGetTodoList] = useState([]);
    const [bool,setBool] = useState(true);
    const [boolForTodo,setBoolForTodo] = useState(true);
    const [status,setStatus] = useState(false);
    const [showTodoFrom,setShowTodoForm] = useState(false);

    useEffect(() => {
        axios.get('https://backendoftodoapp.herokuapp.com/lists/' ).then(function (response){
                setGetList(response.data.lists)
            })
         },[count])

    useEffect(()=> {
        axios.get(`https://backendoftodoapp.herokuapp.com/todo/getTodoById/${listId2}` ).then(function (response){
            setGetTodoList(response.data.listTodos)
            setBoolForTodo(true)
        })
    },[listId2,count])

    const handleSubmit = async ()=> {
       const payload ={
            name: list,
        }
        await axios.post('https://backendoftodoapp.herokuapp.com/lists/addlist', payload).then(function (response){
            if(response.data.message == 'List added successfully'){
                setList('');
                setCount(count + 1)
            }
            else{
                alert('Failed TO Add');
            }
        });
    }

    const handleTodoSubmit = async ()=> {
        const payload = {
            list_id: listId2,
            title: title,
            due_date: datee,
        }
        await axios.post('https://backendoftodoapp.herokuapp.com/todo/addlisttodo', payload).then(function (response) {
            if (response.data.message == 'Todo added successfully') {
                setTitle('');
                setDatee('');
                setCount(count + 1)
            } else {
                alert('Failed TO Add');
            }
        });
    }

    const updateList = async ()=> {
        const payload ={
            name: list,
            _id: listId
        }
        await axios.post('https://backendoftodoapp.herokuapp.com/lists/updatelist', payload).then(function (response){
            if(response.data.message == 'List updated successfully'){
                setList('');
                setCount(count + 1)
            }
            else{
                alert('Failed TO Update');
            }
        });
    }

    const updateListTodo = async ()=> {
        const payload ={
            title: title,
            _id: listId
        }
        await axios.post('https://backendoftodoapp.herokuapp.com/todo/updatelisttodo', payload).then(function (response){
            if(response.data.message == 'Todo updated successfully'){
                setTitle('');
                setCount(count + 1)
                setListId2(response.data.todo.list_id)
            }
            else{
                alert('Failed TO Update');
            }
        });
    }

    const listDelete = async (id) =>{
        await axios.get(`https://backendoftodoapp.herokuapp.com/lists/deletelist/${id}`).then(function (response){
            if(response.data.message == 'List deleted successfully'){
                setCount(count + 1)
                setShowTodoForm(false)
            }
            else{
                alert('Failed TO Delete');
            }
        });
    }
    const todoListDelete = async (id) =>{
        await axios.get(`https://backendoftodoapp.herokuapp.com/todo/deletelisttodo/${id}`).then(function (response){
            if(response.data.message == 'Todo deleted successfully'){
                setCount(count + 1)
                setListId2(response.data.todo.list_id)
            }
            else{
                alert('Failed TO Delete');
            }
        });
    }

    const handleTaskStatus = async (id) => {
        const payload ={
            marked: !status,
        }
        await axios.post(`https://backendoftodoapp.herokuapp.com/todo/updateListTodoStatus/${id}`, payload).then(function (response){
            if(response.data.message == 'Todo Status updated successfully'){
                setTitle('');
                setDatee('');
                setCount(count + 1)
            }
            else{
                alert('Failed TO Add');
            }
        });
    }
    return (
        <>
        <div className="row">
            <div className="col-md-4">
                <div className="">
                    <form className='form_container'>
                        {bool ? (
                            <div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    onChange={(e) => setList(e.target.value)}
                                    value={list}
                                    className="input"
                                    placeholder="Enter List"
                                    required=''
                                />
                            <button type="button" onClick={handleSubmit}>Add</button>
                            </div>
                            ):(
                                <div>
                            <input
                            id="name"
                            name="name"
                            type="text"
                            onChange={(e) => setList(e.target.value)}
                            value={list}
                            className="input"
                            placeholder="Enter List"
                            required=''
                            />
                            <button type="button" onClick={updateList}>Update</button>
                                </div>
                            )
                        }
                    </form>
                </div>
                <div className="">
                    <table style={{border: "3px solid rgb(0, 0, 0)"}}>
                        <thead>
                        <th>Name</th>
                        <th>Edit</th>
                        <th>Delete</th>
                        </thead>
                        <tbody>
                        {getList &&
                            getList.map((item)=>(
                                <tr>
                                    <td onClick={()=>{setListId2(item._id);setShowTodoForm(true);setBoolForTodo(true);setTitle('')}}>{item.name}</td>
                                    <td><button onClick={()=>{setBool(false);setList(item.name);setListId(item._id)}}>Edit</button></td>
                                    <td><button onClick={()=>listDelete(item._id)}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showTodoFrom ? (
                <div>
                    <div className="col-md-8">
                        <div>
                            <form className='form_container'>
                                { boolForTodo ? (
                                    <div>
                                        <div className="row">
                                            <input
                                                id="title"
                                                name="title"
                                                type="text"
                                                onChange={(e) => setTitle(e.target.value)}
                                                value={title}
                                                className="input"
                                                placeholder="Enter Title"
                                                required=''
                                            />
                                            <input
                                                id="date"
                                                name="date"
                                                type="date"
                                                onChange={(e) => setDatee(e.target.value)}
                                                value={datee}
                                                className="input"
                                                placeholder="Enter List"
                                                required=''
                                            />
                                            <button type="button" onClick={handleTodoSubmit}>Add Todo</button>
                                        </div>
                                    </div>
                                ):(
                                    <div>
                                        <div className="row">
                                            <input
                                                id="title"
                                                name="title"
                                                type="text"
                                                onChange={(e) => setTitle(e.target.value)}
                                                value={title}
                                                className="input"
                                                placeholder="Enter Title"
                                                required=''
                                            />
                                            <input
                                                id="date"
                                                name="date"
                                                type="date"
                                                onChange={(e) => setDatee(e.target.value)}
                                                value={datee}
                                                className="input"
                                                placeholder="Enter List"
                                                required=''
                                            />
                                            <button type="button" onClick={updateListTodo}>Update Todo</button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                        {getTodoList.length > 0 ? (
                            <div>
                                <div className="">
                                    <table style={{border:'solid '}}>
                                        <thead>
                                        <th>Marked</th>
                                        <th>Title</th>
                                        <th>Date</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                        </thead>
                                        <tbody>
                                        {getTodoList &&
                                            getTodoList.map((item)=>(
                                                <tr>
                                                    <td>
                                                    {item.marked ? (
                                                        <svg
                                                            className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-1shn170"
                                                            focusable="false" aria-hidden="true" viewBox="0 0 24 24"
                                                            style={{height:'20px',width:'20px'}}
                                                            onClick={()=>handleTaskStatus(item._id)}
                                                            data-testid="CheckIcon" tabIndex="-1" title="Check">
                                                            <path
                                                                d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                                                        </svg>
                                                    ):(
                                                        <svg
                                                            className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-1shn170"
                                                            focusable="false" aria-hidden="true" viewBox="0 0 24 24"
                                                            style={{height:'20px',width:'20px'}}
                                                            onClick={()=>handleTaskStatus(item._id)}
                                                            data-testid="CancelIcon" tabIndex="-1" title="Cancel">
                                                            <path
                                                                d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path>
                                                        </svg>
                                                    )

                                                    }
                                                    </td>
                                                    <td>{item.title}</td>
                                                    <td>{dateFormat(item.due_date,'mmmm d, yyyy')}</td>
                                                    <td><button onClick={()=>{setBoolForTodo(false);setTitle(item.title);setDatee(item.due_date);setListId2(item.list_id);setListId(item._id)}}>Edit</button></td>
                                                    <td><button onClick={()=>todoListDelete(item._id)}>Delete</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                </div>
            )}
        </div>
        </>
    );
};

export default ListForm;