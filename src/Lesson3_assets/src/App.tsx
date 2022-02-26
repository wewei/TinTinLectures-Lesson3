import {
  ChangeEvent,
  DependencyList,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Lesson3 } from "../../declarations/Lesson3";

function useTask(
  setTaskCounter: Dispatch<SetStateAction<number>>,
  callback: () => Promise<void>,
  deps: DependencyList
) {
  return useCallback(async () => {
    setTaskCounter((n) => n + 1);
    await callback();
    setTaskCounter((n) => n - 1);
  }, [setTaskCounter, ...deps]);
}

export default function App() {
  const [value, setValue] = useState<bigint>(0n);
  const [displayValue, setDisplayValue] = useState<bigint>(0n);
  const isDirty = displayValue !== value;
  const [taskCounter, setTaskCounter] = useState(0);
  const inputRef = useRef<typeof Input>(null);

  const update = useTask(
    setTaskCounter,
    async () => {
      const newValue = await Lesson3.get();
      setValue(newValue);
      setDisplayValue(newValue);
    },
    [setValue]
  );

  const inc = useTask(
    setTaskCounter,
    async () => {
      await Lesson3.increment();
      update();
    },
    [update]
  );

  const updateInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const str = e.target.value.replace(/^\D*/, "").replace(/\D.*/, "");
      setDisplayValue(BigInt(str));
    },
    [setDisplayValue]
  );

  const set = useTask(
    setTaskCounter,
    async () => {
      await Lesson3.set(displayValue);
      update();
    },
    [update, displayValue]
  );
  const reset = useCallback(
    () => setDisplayValue(value),
    [setDisplayValue, value]
  );

  useEffect(() => {
    update();
  }, [update]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={3}>
        <Card sx={{ width: 480, backgroundColor: "WhiteSmoke" }}>
          <CardContent>
            <img src="logo.png" width="100%" />
            <Box sx={{ marginBottom: 3 }}>
              <Typography sx={{ fontWeight: "Bold" }}>
                Homework for Lesson 3
              </Typography>
              <ul>
                <li>
                  <Typography>
                    Hit the "Increment" button to increase the value by 1
                  </Typography>
                </li>
                <li>
                  <Typography>
                    Change the value of text field to direct set the value
                  </Typography>
                </li>
              </ul>
            </Box>

            <TextField
              value={displayValue.toString()}
              type="number"
              // inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              fullWidth
              onChange={updateInput}
              label={isDirty ? "New Value" : "Current Value"}
            />
          </CardContent>
          <CardActions>
            <Button onClick={isDirty ? set : inc} disabled={taskCounter > 0}>
              {isDirty ? "Set" : "Increment"}
            </Button>
            {isDirty && (
              <Button onClick={reset} disabled={taskCounter > 0}>
                Reset
              </Button>
            )}
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}
