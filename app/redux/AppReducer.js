const initialState = {
  sketches: [],
  settings: {
    theme: 'dark',
  },
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        settings: {
          ...state.settings,
          theme: action.newTheme,
        },
      };

    case 'NEW_SKETCH':
      return {
        ...state,
        sketches: [
          {
            name: generateRandomName(),
            lines: [],
          },
          ...state.sketches,
        ],
      };

    case 'DELETE_SKETCH':
      return {
        ...state,
        sketches: state.sketches.filter((s, i) => i !== action.index),
      };

    case 'ADD_LINE':
      return {
        ...state,
        sketches: state.sketches.map((s, i) => (i === action.index
          ? {
            ...s,
            lines: [
              ...s.lines,
              { points: [action.coord], color: action.color },
            ],
          }
          : s)),
      };

    case 'ADD_POINT':
      return {
        ...state,
        sketches: state.sketches.map((s, i) => (i === action.index
          ? {
            ...s,
            lines: s.lines.map((l, li) => (li === s.lines.length - 1
              ? { ...l, points: [...l.points, action.coord] }
              : l)),
          }
          : s)),
      };

    case 'CANCEL_CURRENT':
      return {
        ...state,
        sketches: state.sketches.map((s, i) => (i === action.index
          ? {
            ...s,
            lines: s.lines.filter((l, li) => li < s.lines.length - 1),
          }
          : s)),
      };

    case 'DELETE_ALL_LINES':
      return {
        ...state,
        sketches: state.sketches.map((s, i) => (i === action.index
          ? {
            ...s,
            lines: [],
          }
          : s)),
      };

    case 'DELETE_LINE':
      return {
        ...state,
        sketches: state.sketches.map((s, i) => (i === action.index
          ? {
            ...s,
            lines: s.lines.filter((l, li) => li !== action.lineIndex),
          }
          : s)),
      };

    default:
      return state;
  }
};

export function generateRandomName() {
  const chars = ' a bcd e fg h ijklmn o pqrst uvw x y z eee e tt sh o  i aa eeeeee iii hhttsccchunnnmmmnseetrrrrrulllk';
  let str = '';
  const length = Math.floor(Math.random() * 5) + 8;
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  str = str.trim();
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
}

export default AppReducer;
