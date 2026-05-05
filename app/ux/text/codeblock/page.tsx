'use client';

import CodeBlock from '@/components/ux/text/CodeBlock';
import Typography from '@/components/ux/text/Typography';


export default function Page() {
  return (
    <div style={{ padding: 20 }}>
      <Typography type='h5' style={{ marginBottom: 20 }}>CodeBlock</Typography>
      <Typography type='body1' style={{ marginBottom: 10 }}>Display chunks of code inside a block, the contents can be copied!</Typography>

      <CodeBlock code = {`
        <div>hello world</div>
      `} />

      <Typography type='body1' style={{ marginBottom: 10 }}>Language is defaulted to typescript, but supports, python and sh (for simple syntax highlights)</Typography>

      <CodeBlock lang='py' code = {`
        import time
        start_time = time.time()

        stuff = {}

        for s in stuff:
          print(s)
        
        print(f"Time taken stats: {time.time() - start_time} seconds")
      `} />


      <CodeBlock code = {`
        import CodeBlock from '@/components/ux/text/CodeBlock';

        <CodeBlock code = {\`
          <div>hello world</div>
        \`} />
      `} />


    </div>
  );
}

