export async function greet(name: string): Promise<string> {
    return `Hello, ${name}!`;
  }

export async function Hi(name: string): Promise<string> {
  return `Hi, ${name}!`;
}


export async function imSleep(duration: string=""): Promise<string> {
  return `sleep, ${duration}!`;
}

export async function bye(name: string): Promise<string> {
  return `Bye, ${name}!`;
}