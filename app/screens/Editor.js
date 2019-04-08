import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { Appbar, TouchableRipple } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../tools/Colors';
import MultiTouch from '../components/MultiTouch';
import Confirm from '../components/Confirm';

class Editor extends React.Component {
  state = {
    svgDimentions: {
      width: 100,
      height: 100,
    },
    transform: {
      x: 0,
      y: 0,
    },
    colorIndex: 0,
    tool: 'pen',
    colorPickerVisible: false,
  };

  prevTouch = { x: 0, y: 0 };

  onPanStart = (evt) => {
    const { dispatch, index } = this.props;
    this.prevTouch = this.evtToCoord(evt, false);
    dispatch({ type: 'CANCEL_CURRENT', index });
  };

  onPanMove = (evt) => {
    const touch = this.evtToCoord(evt, false);
    const dx = this.prevTouch.x - touch.x;
    const dy = this.prevTouch.y - touch.y;
    this.prevTouch = touch;
    this.setState(state => ({
      transform: {
        x: state.transform.x + dx,
        y: state.transform.y + dy,
      },
    }));
  };

  onTouchStart = (evt) => {
    const { tool } = this.state;
    switch (tool) {
      case 'pen':
        this.onDrawStart(evt);
        break;

      default:
        break;
    }
  };

  onTouchMove = (evt) => {
    const { tool } = this.state;
    switch (tool) {
      case 'pen':
        this.onDrawMove(evt);
        break;

      case 'eraser':
        this.onEraserMove(evt);
        break;

      default:
        break;
    }
  };

  onDrawStart = (evt) => {
    const { dispatch, index } = this.props;
    const { colorIndex } = this.state;
    dispatch({
      type: 'ADD_LINE',
      index,
      coord: this.evtToCoord(evt),
      color: Colors.penColors[colorIndex],
    });
  };

  onDrawMove = (evt) => {
    const { dispatch, index } = this.props;
    dispatch({ type: 'ADD_POINT', index, coord: this.evtToCoord(evt) });
  };

  onEraserMove = (evt) => {
    const { dispatch, index, sketch } = this.props;
    const touch = this.evtToCoord(evt);
    for (let i = 0; i < sketch.lines.length; i++) {
      if (sketch.lines[i].points.length >= 2) {
        for (let k = 0; k < sketch.lines[i].points.length - 1; k++) {
          const point = sketch.lines[i].points[k];
          const nextPoint = sketch.lines[i].points[k + 1];
          if (doesLineInterceptCircle(point, nextPoint, touch, 30)) {
            dispatch({ type: 'DELETE_LINE', index, lineIndex: i });
            return;
          }
        }
      }
    }
  };

  clearAllLines = async () => {
    const sure = await Confirm(
      'Are You Sure',
      'This will delete all lines. Cannot undo',
    );
    if (!sure) return;
    const { dispatch, index } = this.props;
    dispatch({ type: 'DELETE_ALL_LINES', index });
  };

  coordToString = (prefix, coord) => {
    const { transform } = this.state;
    return `${prefix}${coord.x - transform.x} ${coord.y - transform.y} `;
  };

  evtToCoord = (evt, shouldTransform = true) => {
    const { transform } = this.state;
    const modx = shouldTransform ? transform.x : 0;
    const mody = shouldTransform ? transform.y : 0;
    const coord = {
      x: modx + evt.nativeEvent.locationX,
      y: mody + evt.nativeEvent.locationY,
    };
    return coord;
  };

  renderLines = () => {
    const { sketch } = this.props;
    const paths = sketch.lines.map((line) => {
      let str = this.coordToString('M', line.points[0]);
      for (let i = 1; i < line.points.length; i++) {
        str += this.coordToString('L', line.points[i]);
      }
      return str;
    });
    return (
      <>
        {paths.map((path, i) => (
          <Path
            key={i.toString()}
            d={path}
            stroke={sketch.lines[i].color}
            fill="none"
          />
        ))}
      </>
    );
  };

  render() {
    const {
      svgDimentions, colorIndex, tool, colorPickerVisible,
    } = this.state;
    const { navigation } = this.props;
    return (
      <SafeAreaView style={{ backgroundColor: Colors.background, flex: 1 }}>
        <View
          style={{ flex: 1 }}
          onLayout={e => this.setState({ svgDimentions: e.nativeEvent.layout })}
        >
          <MultiTouch
            numTouches={2}
            onTouchStart={this.onPanStart}
            onTouchMove={this.onPanMove}
          >
            <MultiTouch
              numTouches={1}
              onTouchStart={this.onTouchStart}
              onTouchMove={this.onTouchMove}
            >
              <Svg {...svgDimentions}>{this.renderLines()}</Svg>
            </MultiTouch>
          </MultiTouch>
        </View>
        {colorPickerVisible && (
          <Appbar style={{ backgroundColor: Colors.darkBackground }}>
            <View style={{ flex: 1 }} />
            <View
              style={{
                paddingHorizontal: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {Colors.penColors.map((color, i) => (
                <TouchableRipple
                  onPress={() => this.setState({ colorIndex: i, colorPickerVisible: false })
                  }
                  key={color}
                  style={{
                    margin: 5,
                  }}
                >
                  <View
                    style={{
                      borderRadius: 20,
                      backgroundColor: color,
                      width: i === colorIndex ? 32 : 25,
                      height: i === colorIndex ? 32 : 25,
                    }}
                  />
                </TouchableRipple>
              ))}
            </View>
          </Appbar>
        )}
        <Appbar style={{ backgroundColor: Colors.darkBackground }}>
          <Appbar.Action
            color={Colors.primary}
            icon="arrow-back"
            onPress={() => navigation.goBack()}
          />
          <View style={{ flex: 1 }} />
          <Appbar.Action
            color={Colors.primary}
            icon="delete"
            onPress={this.clearAllLines}
          />
          <Appbar.Action
            color={Colors.primary}
            icon={
              tool === 'pen'
                ? 'edit'
                : props => <CommunityIcon {...props} name="eraser-variant" />
            }
            onPress={() => {
              if (tool === 'pen') {
                this.setState({ tool: 'eraser' });
              } else {
                this.setState({ tool: 'pen' });
              }
            }}
          />
          <Appbar.Action
            color={Colors.penColors[colorIndex]}
            icon="color-lens"
            onPress={() => {
              this.setState({ colorPickerVisible: true });
            }}
          />
        </Appbar>
      </SafeAreaView>
    );
  }
}

Editor.navigationOptions = () => ({
  header: null,
});

const mapStateToProps = ({ sketches }, { navigation }) => ({
  index: navigation.getParam('index'),
  sketch: sketches[navigation.getParam('index')],
});

export default connect(mapStateToProps)(Editor);

function doesLineInterceptCircle(A, B, C, radius) {
  let dist;
  const v1x = B.x - A.x;
  const v1y = B.y - A.y;
  const v2x = C.x - A.x;
  const v2y = C.y - A.y;
  // get the unit distance along the line of the closest point to
  // circle center
  const u = (v2x * v1x + v2y * v1y) / (v1y * v1y + v1x * v1x);

  // if the point is on the line segment get the distance squared
  // from that point to the circle center
  if (u >= 0 && u <= 1) {
    dist = (A.x + v1x * u - C.x) ** 2 + (A.y + v1y * u - C.y) ** 2;
  } else {
    // if closest point not on the line segment
    // use the unit distance to determine which end is closest
    // and get dist square to circle
    dist = u < 0
      ? (A.x - C.x) ** 2 + (A.y - C.y) ** 2
      : (B.x - C.x) ** 2 + (B.y - C.y) ** 2;
  }
  return dist < radius * radius;
}
