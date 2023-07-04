import { useRouter } from '../hook/useRouter';

export const About = () => {
  const { push } = useRouter();
  return (
    <>
      <button onClick={() => push("/")}>Go to Root</button>
      <button>About Page</button>
    </>
  );
};
