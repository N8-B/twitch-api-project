import React from 'react';
const {Grid, Row, Col} = require('react-flexbox-grid');
import ProgressBar from 'react-toolbox/lib/progress_bar';
import style from './style';

const Spinner = () => (
  <Grid>
    <Row>
      <Col xs={12}>
        <Row center="xs">
          <Col xs={6}>
            <ProgressBar className={style.spinner} type="circular" mode="indeterminate" />
          </Col>
        </Row>
      </Col>
    </Row>
  </Grid>

);

export default Spinner;
