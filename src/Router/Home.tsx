import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../App";


export default function Home({ setUserName }: { setUserName: React.Dispatch<React.SetStateAction<string>> }) {

  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('name');
    if (input instanceof HTMLInputElement) {
      const name = input.value;
      socket.emit('welcome', name, (res: { ok: boolean, message: string }) => {
        if (res.ok) {
          console.log(res.message);
          setUserName(name);
          navigate('/roomList');
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="write your name" name='name' required />
      <button>입력</button>
    </form>

  );
}