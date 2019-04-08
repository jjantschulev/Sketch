import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { Appbar, TouchableRipple } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
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
    const { dispatch, index } = this.props;
    const { colorIndex } = this.state;
    dispatch({
      type: 'ADD_LINE',
      index,
      coord: this.evtToCoord(evt),
      color: Colors.penColors[colorIndex],
    });
  };

  onTouchMove = (evt) => {
    const { dispatch, index } = this.props;
    dispatch({ type: 'ADD_POINT', index, coord: this.evtToCoord(evt) });
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
    const { svgDimentions, colorIndex } = this.state;
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
        <Appbar style={{ backgroundColor: Colors.darkBackground }}>
          <Appbar.Action
            color={Colors.primary}
            icon="arrow-back"
            onPress={() => navigation.goBack()}
          />
          <Appbar.Action
            color={Colors.primary}
            icon="delete"
            onPress={this.clearAllLines}
          />
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
                onPress={() => this.setState({ colorIndex: i })}
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
