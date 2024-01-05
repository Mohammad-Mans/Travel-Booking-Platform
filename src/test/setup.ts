import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

//to unmount react trees that were mounted with render
afterEach(()=>{
    cleanup();
})