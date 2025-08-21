import React from 'react'
import { Protect } from '@clerk/nextjs'

function page() {
  return (
    <>
    <Protect
    condition={(has) => has({role: 'instuctor'})}
    >
    <div>Instuctor Dashboard</div>
    </Protect>
    <Protect
    condition={(has) => has({role: 'trainer'})}
    >
    <div>Trainer Dashboard</div>
    </Protect>
    <Protect
    condition={(has) => has({role: 'main'})}
    >
      <div>Admin Dashboard</div>
    </Protect>
    <Protect
    condition={(has) => has({role: 'admin'})}
    >
      <div>School Coordinator Dashboard</div>
    </Protect>
    <Protect
    >
      <div>STUDENT</div>
    </Protect>
    </>
   
  )
}

export default page