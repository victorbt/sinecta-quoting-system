'use client'

import { redirect } from 'next/navigation';
import { withJwtAuthenticator } from '../components/auth/with-authenticator';

const Home=() =>{    
    redirect('/quotes')
}

export default withJwtAuthenticator(Home, {
   
})