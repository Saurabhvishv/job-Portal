import React, { useState } from 'react' //
import axios from "axios"
import './jobCreate.css';
const JobCreate = () => {
  const [job, setjob] = useState({
    companyname:"", designation:"", description:"", address:"", vacancy:"", salary:"", startdate:""
  })
  const [task, setTask] = useState([])

  let name, value;
  const handleInputs = (e) => {
    console.log(e)
    name = e.target.name;
    value = e.target.value;

    setjob({ ...job, [name]: value })

  }

  async function getalldata() {

    const resp = await axios.get('/jobDetails')
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

  const Postjob = async (e) => {
    e.preventDefault();

    const { companyname, designation, description, address, vacancy, salary, startdate } = job

    const res = await fetch('/registerjob', {

      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        companyname, designation, description, address, vacancy, salary, startdate
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
      <section className='registerjob'>
        <div className='container mt-5'>
          <div className='jobCreate-content'>
            <div className='task-form'>
              <h2 className='form-title'>jobCreate-Task</h2>


              <form method="POST" className='task-form' id='registerjob'>

                <div className='form-group p-2'>
                  <label htmlFor='companyname'></label>
                  <input type='companyname' name='companyname' id='companyname' autoComplete='off'
                    value={job.name}
                    onChange={handleInputs}
                    placeholder='enter companyname'
                  />

                </div>

                <div className='form-group p-2'>
                  <label htmlFor='designation'></label>
                  <input type='designation' name='designation' id='designation' autoComplete='off'
                    value={job.name}
                    onChange={handleInputs}
                    placeholder='enter designation'
                  />

                </div>

                <div className='form-group p-2'>
                  <label htmlFor='address'></label>
                  <input type='address' name='address' id='address' autoComplete='off'
                    value={job.address}
                    onChange={handleInputs}
                    placeholder='enter address'
                  />

                </div>

                <div className='form-group p-2'>
                  <label htmlFor='vacancy'></label>
                  <input type='vacancy' name='vacancy' id='vacancy' autoComplete='off'
                    value={job.vacancy}
                    onChange={handleInputs}
                    placeholder='enter vacancy'
                  />
                </div>
                <div className='form-group p-2'>
                  <label htmlFor='salary'></label>
                  <input type='salary' name='salary' id='salary' autoComplete='off'
                    value={job.salary}
                    onChange={handleInputs}
                    placeholder='enter salary'
                  />
                </div>

                <div className='form-group p-2'>
                  <label htmlFor='startdate'></label>
                  <input type='startdate' name='startdate' id='startdate' autoComplete='off'
                    value={job.startdate}
                    onChange={handleInputs}
                    placeholder='enter startdate'
                  />
                </div>

                <div className='form-group form-button p-2'>
                  <input type='submit' name='Task form' id='Task form' className='form-submit'
                    value='Submit' onClick={Postjob}
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

export default JobCreate

