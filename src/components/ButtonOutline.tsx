const ButtonOutline = ({ text }: any) => {
  return (
    <div>
      <div className="horizontal-divider"></div>
      <div className="btn-lines">
        <small>{text}</small>
        <div className="line-top amber">&nbsp;</div>
        <div className="line-right amber">&nbsp;</div>
        <div className="line-bottom amber">&nbsp;</div>
        <div className="line-left amber">&nbsp;</div>
      </div>
    </div>
  );
};

export default ButtonOutline;
