from back_end.order_monitor import OrderMonitor


def loop_jobs():
    monitor = OrderMonitor()
    monitor.run_loop()

    return