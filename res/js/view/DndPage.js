import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
const ItemTypes = {
  KNIGHT: "knight",
};

// const listData = [
//   { id: 1, name: "test" },
//   { id: 1, name: "test" },
// ];
export const DndPage = () => {
  const [listData, setData] = useState([
    { id: 1, name: "test1" },
    { id: 2, name: "test2" },
    { id: 3, name: "test3" },
    { id: 4, name: "test4" },
  ]);

  const [currentIndex, setIndex] = useState();

  const [addFlag, setAddFlag] = useState(true);

  const DataChange = (index) => {
    console.log(currentIndex);
    // console.log(listData[index]);

    var adjustIndex = 0;
    if (currentIndex > index) {
      adjustIndex = 1;
    }
    listData.splice(index, 0, listData[currentIndex]);
    listData.splice(currentIndex - adjustIndex, 1);

    // Array.prototype.splice.apply(
    //   listData,
    //   [listData[index], 0].concat(listData[currentIndex])
    // );
    var array = listData.concat();
    setData(array);
    console.log(array);
  };

  const DataHoverChange = (index) => {
    console.log(addFlag);
    if (currentIndex != index && addFlag) {
      setAddFlag(false);
      listData.splice(index, 0, listData[currentIndex]);
      // listData.splice(currentIndex, 1);

      var array = [...listData];
      setData(listData);
      console.log(index);
    }
  };

  const Begin = (index) => {
    setIndex(index);
  };

  const ItemList = ({ name, index }) => {
    const ItemTypes = {
      KNIGHT: "name",
    };
    const [{ isOver }, drop] = useDrop(() => ({
      accept: ItemTypes.KNIGHT,
      drop: () => DataChange(index),
      // hover: () => DataHoverChange(index),
    }));
    const [{ isDragging, handlerId }, drag] = useDrag(() => ({
      item: { type: ItemTypes.KNIGHT },
      begin: () => Begin(index),
      // collect: (props) => ({
      //   isOver: props,
      // }),

      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }));
    const opacity = isDragging ? 0.4 : 1;
    console.log(opacity);
    console.log(handlerId);
    return (
      <Area ref={drop}>
        <ItemIcon ref={drag}>{name}</ItemIcon>
      </Area>
    );
  };

  return (
    <React.Fragment>
      {listData.map((column, index) => (
        <div key={index}>
          <ItemList name={column.name} index={index} />
        </div>
      ))}
    </React.Fragment>
  );
};

const Area = styled.div`
  display: inline-block;
  height: 200px;
  width: 200px;
  background: #fff;
`;

const ItemIcon = styled.div`
  display: inline-block;
  border-radius: 50%;
  height: 16px;
  width: 16px;
  background: #002;
`;
