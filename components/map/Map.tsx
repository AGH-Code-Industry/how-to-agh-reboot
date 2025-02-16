type Props = {
  test: string;
};

export default function Map(props: Props) {
  console.log(props.test);

  return (
    <div>
      <h1>Map</h1>
    </div>
  );
}
