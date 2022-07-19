import React, { useState } from 'react' //
import axios from "axios"
import './create.css';
const Create = () => {
  const [user, setUser] = useState({
    name: "", email: "", password: ""
  })
  const [task, setTask] = useState([])

  let name, value;
  const handleInputs = (e) => {
    console.log(e)
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value })

  }

  async function getalldata() {

    const resp = await axios.get('/getuser')
    setTask([...resp.data.data])
  }
  getalldata()


  
   async function doneTask(id){
     //console.log(id)
  let find=task.find(e=>e._id===id)
  //console.log(find)
    await axios.put(`/update/${find._id}`)
   }
console.log(task)

  const PostData = async (e) => {
    e.preventDefault();

    const { name, email, password } = user

    const res = await fetch('/registeruser', {

      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name, email, password
      })
    })

    const data = await res.json()

    if (data.status === 400 || !data) {
      window.alert('invalid data')
      console.log('invalid data')
    } else {
      window.alert('perfect data')
      console.log('perfect data')
      //history.push('/Home')
    }
  }


  return (
    <>
      <section className='registeruser'>
        <div className='container mt-5'>
          <div className='create-content'>
            <div className='task-form'>
              <h2 className='form-title'>Create-Task</h2>


              <form method="POST" className='task-form' id='registeruser'>

                <div className='form-group p-2'>
                  <label htmlFor='name'></label>
                  <input type='name' name='name' id='name' autoComplete='off'
                    value={user.name}
                    onChange={handleInputs}
                    placeholder='enter name'
                  />

                </div>

                <div className='form-group p-2'>
                  <label htmlFor='email'></label>
                  <input type='email' name='email' id='email' autoComplete='off'
                    value={user.email}
                    onChange={handleInputs}
                    placeholder='enter email'
                  />
                </div>
                <div className='form-group p-2'>
                  <label htmlFor='password'></label>
                  <input type='password' name='password' id='password' autoComplete='off'
                    value={user.email}
                    onChange={handleInputs}
                    placeholder='enter password'
                  />
                </div>

                <div className='form-group form-button p-2'>
                  <input type='submit' name='Task form' id='Task form' className='form-submit'
                    value='Submit' onClick={PostData}
                  />
                </div>

              </form>
            </div>
          </div>

         <div>
             { task.map(data=>data.status==='Open'&&
             <div className=''>
            
               <span className='comp'>{data.title}</span>
               <button className='op' onClick={()=>doneTask(data._id)}>done</button>
             </div>
                )}
              </div>

        </div>
      </section>
    </>
  )
}

export default Create

