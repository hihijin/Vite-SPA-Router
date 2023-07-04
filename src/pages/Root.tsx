import { useRouter } from '../hook/useRouter';

export const Root = () => {
  const { push } = useRouter();
  return (
    <>
      <button>Root Page</button>
      <button onClick={() => push("/about")}>Go to About</button>
    </>
  );
};
